'use strict';
require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const userRepository = require('../repositories/UserRepository');
const RegisterDTO = require('../dto/RegisterDTO');
const LoginDTO = require('../dto/LoginDTO');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'taskflow_access_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'taskflow_refresh_secret';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

class AuthService {
  /**
   * Register a new user.
   * Uses RegisterDTO for validation before processing.
   */
  async register(name, email, password) {
    const dto = new RegisterDTO({ name, email, password });
    const { valid, errors } = dto.validate();
    if (!valid) throw new Error(errors.join('; '));

    const existing = await userRepository.findByEmail(dto.email);
    if (existing) throw new Error('An account with this email already exists.');

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const record = await userRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: 'USER',
    });

    const user = User.fromPrisma(record);
    const { accessToken, refreshToken } = await this._generateTokenPair(user.id);

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
      // legacy single-token field kept for compatibility
      token: accessToken,
    };
  }

  /**
   * Authenticate user and return token pair.
   */
  async login(email, password) {
    const dto = new LoginDTO({ email, password });
    const { valid, errors } = dto.validate();
    if (!valid) throw new Error(errors.join('; '));

    const record = await userRepository.findByEmail(dto.email);
    if (!record) throw new Error('Invalid email or password.');

    const isMatch = await bcrypt.compare(dto.password, record.password);
    if (!isMatch) throw new Error('Invalid email or password.');

    const user = User.fromPrisma(record);
    const { accessToken, refreshToken } = await this._generateTokenPair(user.id);

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
      // legacy single-token field
      token: accessToken,
    };
  }

  /**
   * Rotate refresh token: validates the old one and issues a new pair.
   */
  async refresh(refreshToken) {
    if (!refreshToken) throw new Error('Refresh token is required.');

    // Find token in DB
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.isRevoked) {
      throw new Error('Invalid or revoked refresh token.');
    }
    if (new Date() > storedToken.expiresAt) {
      throw new Error('Refresh token has expired. Please log in again.');
    }

    // Verify JWT signature
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch {
      throw new Error('Invalid refresh token signature.');
    }

    // Revoke old token (token rotation for security)
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    const user = User.fromPrisma(storedToken.user);
    const tokens = await this._generateTokenPair(user.id);

    return {
      user: user.toJSON(),
      ...tokens,
      token: tokens.accessToken,
    };
  }

  /**
   * Logout — revoke the provided refresh token.
   */
  async logout(refreshToken) {
    if (!refreshToken) return;
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { isRevoked: true },
    });
  }

  /**
   * Generate a new access + refresh token pair and persist the refresh token.
   * @private
   */
  async _generateTokenPair(userId) {
    const { randomUUID } = require('crypto');
    const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    // jti (JWT ID) ensures every refresh token is unique even if issued in the same second
    const refreshToken = jwt.sign({ userId, jti: randomUUID() }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);

    await prisma.refreshToken.create({
      data: { token: refreshToken, userId, expiresAt },
    });

    return { accessToken, refreshToken };
  }

  /**
   * Generate a single access token (legacy helper).
   */
  generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  }
}

module.exports = new AuthService();
