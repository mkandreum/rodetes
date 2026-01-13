import { ButtonHTMLAttributes } from 'react';


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg';
}

const Button = ({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) => {
    const baseStyles = "font-pixel font-bold transition-all duration-300 rounded-none border border-transparent shadow-lg hover:shadow-xl transform hover:-translate-y-0.5";

    const variants = {
        primary: "bg-white text-black hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.3)]",
        secondary: "bg-gray-800 text-white hover:bg-gray-700 border-gray-600 shadow-[0_0_15px_rgba(128,128,128,0.3)]",
        danger: "bg-red-600 text-white hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]",
        outline: "bg-transparent border-2 border-white text-white hover:bg-white hover:text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]"
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-lg",
        lg: "px-8 py-4 text-xl"
    };

    const textShadow = {
        primary: "",
        secondary: "style-text-shadow-white",
        danger: "style-text-shadow-white",
        outline: "style-text-shadow-white"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${textShadow[variant]} ${className || ''}`}
            {...props}
        />
    );
};

export default Button;
