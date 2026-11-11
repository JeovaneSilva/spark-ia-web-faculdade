import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  variant?: 'default' | 'correct' | 'incorrect';
}

export const Card = ({ children, title, className = '', variant = 'default' }: CardProps) => {
  const variants = {
    default: "bg-brand-card border-transparent",
    correct: "bg-green-900/30 border border-status-success",
    incorrect: "bg-red-900/30 border border-status-error"
  };

  return (
    <div className={`${variants[variant]} p-4 sm:p-6 rounded-card shadow-card ${className}`}>
      {title && <h3 className="mb-4">{title}</h3>}
      {children}
    </div>
  );
};