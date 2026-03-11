import type { InputHTMLAttributes } from 'react';

export const Input = (props: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      {...props}
      className="w-full px-4 py-3 bg-brand-sidebar border border-white/10 rounded-input text-content-primary placeholder:text-content-disabled focus:border-brand-orange focus:outline-none transition-all"
    />
  );
};