import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'pill';
}

export const Button = ({ variant = 'primary', className = '', ...props }: ButtonProps) => {
  const baseStyles = "transition-colors duration-200 font-semibold flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50";
  
  const variants = {
    primary: "bg-brand-orange text-white hover:bg-brand-orange-hover rounded-button px-6 py-3",
    outline: "border border-brand-orange text-brand-orange hover:bg-brand-orange/10 rounded-button px-6 py-3",
    pill: "bg-brand-orange text-white hover:bg-brand-orange-hover rounded-full px-8 py-2 text-sm"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props} 
    />
  );
};