import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  ...props 
}: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#ff6b4a] hover:bg-[#ed4d26] text-white shadow-md",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-800",
    outline: "bg-transparent border border-slate-200 hover:border-orange-300 text-slate-800 hover:bg-orange-50/50",
    danger: "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {isLoading ? 'Loading...' : children}
    </button>
  );
}
