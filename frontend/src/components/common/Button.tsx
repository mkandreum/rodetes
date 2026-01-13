import { ButtonHTMLAttributes } from 'react';


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg';
}

const Button = ({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) => {
    const baseStyles = "font-pixel font-bold transition-all duration-300 rounded-none border border-transparent";

    const variants = {
        primary: "bg-rodetes-pink text-white hover:bg-pink-600",
        secondary: "bg-gray-800 text-white hover:bg-gray-700 border-gray-600",
        danger: "bg-red-600 text-white hover:bg-red-500",
        outline: "bg-transparent border-2 border-white text-white hover:bg-white hover:text-black"
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ''}`}
            {...props}
        />
    );
};

export default Button;
