import React from 'react';

// Button component with different variants
export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-300',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-300',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
  };
  
  const sizeStyles = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-sm',
    lg: 'py-2 px-6 text-base',
  };
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Card component for containing content
export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
      {children}
    </div>
  );
};

// Slider component for selecting values on a range
export const Slider = ({ min, max, value, onChange, labels = {} }) => {
  const handleChange = (e) => {
    onChange(parseInt(e.target.value, 10));
  };
  
  const getLabel = (position) => {
    return labels[position] || position;
  };
  
  // Calculate percentage for the track fill
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="w-full px-2">
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="absolute h-2 bg-amber-500 rounded-full" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          className="absolute w-full h-2 opacity-0 cursor-pointer"
        />
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-gray-600">
        {[min, Math.floor((min + max) / 2), max].map((position) => (
          <span key={position}>
            {getLabel(position)}
          </span>
        ))}
      </div>
    </div>
  );
};

// Checkbox component with a label
export const Checkbox = ({ id, checked, onChange, label, className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded text-amber-500 focus:ring-amber-500 border-gray-300"
      />
      <label htmlFor={id} className="ml-2 block text-sm text-gray-700">
        {label}
      </label>
    </div>
  );
};

// Loading spinner component
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  
  return (
    <div className={`animate-spin rounded-full border-t-2 border-r-2 border-amber-500 ${sizeStyles[size]} ${className}`}></div>
  );
};

// Badge component for showing small pieces of information
export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-amber-100 text-amber-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
  };
  
  return (
    <span className={`inline-block text-xs px-2 py-1 rounded-full ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Input component for text input
export const Input = ({ 
  id, 
  type = 'text', 
  label, 
  value, 
  onChange, 
  placeholder = '', 
  error = '', 
  className = '' 
}) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full p-2 border rounded-md ${error ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};