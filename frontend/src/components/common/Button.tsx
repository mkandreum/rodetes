import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'neon';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = 'font-pixel transition-all duration-300 focus:outline-none flex items-center justify-center';

    const variants = {
        // Legacy "Standard" Button (White BG, Black Text, Gray Border) -> Used for utilitarian actions
        primary: 'bg-white text-black border border-gray-400 hover:bg-gray-300',
        // Legacy "Neon" Button (Pink Glow) -> Used for CTAs/Primary Actions
        neon: 'neon-btn',
        secondary: 'bg-gray-700 text-white hover:bg-gray-600',
        danger: 'bg-red-900/50 text-red-200 border border-red-500 hover:bg-red-900',
        outline: 'bg-transparent border border-white text-white hover:bg-white/10',
    };

    const sizes = {
        sm: 'px-3 py-1 text-sm',
        md: 'px-6 py-2 text-xl',
        lg: 'px-8 py-3 text-2xl',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : null}
            {children}
        </button>
    );
};

export default Button;
