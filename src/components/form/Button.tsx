import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export default function Button(
  { children, variant = "primary", className = "", ...props }: ButtonProps) {
  const baseStyles = "font-medium px-4 py-2 rounded-lg transition ";
  const hoverStyles = "hover:cursor-pointer";
  const variants = {
    primary: "btn-primary",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  };

  return (
    <button
      className={`${baseStyles} ${hoverStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}