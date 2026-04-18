import React from 'react';

const Badge = ({ variant = 'pending', children }) => {
  const variants = {
    low: "bg-green-50 text-green-700 border border-green-100",
    medium: "bg-yellow-50 text-yellow-700 border border-yellow-100",
    high: "bg-red-50 text-red-700 border border-red-100",
    pending: "bg-orange-50 text-orange-700 border border-orange-100",
    in_progress: "bg-indigo-50 text-primary border border-indigo-100",
    done: "bg-green-50 text-green-700 border border-green-100"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant] || variants.pending}`}>
      {children}
    </span>
  );
};

export default Badge;
