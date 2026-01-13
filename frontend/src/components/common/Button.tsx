import React from 'react';
import { cn } from '../../utils/cn'; // Assuming utility or simple class merge

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg';
}

const Button = ({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) => {
    const baseStyles = "font-pixel transition-colors duration-300 rounded-none border border-transparent";

    const variants = {
        primary: "bg-white text-black hover:bg-gray-300",
        secondary: "bg-gray-800 text-white hover:bg-gray-700 border-gray-600",
        danger: "bg-red-600 text-white hover:bg-red-500",
        outline: "bg-transparent border-white text-white hover:bg-white hover:text-black"
    };

    const sizes = {
        sm: "px-3 py-1 text-sm",
        md: "px-6 py-2 text-lg",
        lg: "px-8 py-3 text-xl"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ''}`}
            {...props}
        />
    );
};

export default Button;
