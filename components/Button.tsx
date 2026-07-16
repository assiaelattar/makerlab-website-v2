import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  ...props
}) => {
  const baseStyles = "ml-button border font-sans disabled:cursor-not-allowed disabled:opacity-50";

  const variants = {
    primary: "border-brand-red bg-brand-red text-white shadow-sm hover:bg-[#a92127]",
    secondary: "border-brand-blue bg-brand-blue text-white shadow-sm hover:bg-[#1d528e]",
    accent: "border-brand-orange bg-brand-orange text-white shadow-sm hover:bg-[#d56818]",
    outline: "border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base md:text-lg",
    lg: "px-8 py-4 text-lg md:text-xl"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : children}
    </button>
  );
};
