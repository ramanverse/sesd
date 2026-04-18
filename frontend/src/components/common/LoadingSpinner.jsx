import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-10 w-10 border-3',
  };

  const colorClasses = {
    primary: 'border-primary',
    white: 'border-white',
    gray: 'border-gray-300',
  };

  return (
    <div className={`animate-spin rounded-full border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}></div>
  );
};

export default LoadingSpinner;
