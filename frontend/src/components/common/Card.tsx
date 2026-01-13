import React from 'react';

interface CardProps {
    image?: string;
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
    color?: string; // Hex color for border or accent
    imageProps?: React.ImgHTMLAttributes<HTMLImageElement>;
}

const Card = ({ image, title, subtitle, children, footer, className, color, imageProps }: CardProps) => {
    const borderStyle = color ? { borderColor: color } : {};

    return (
        <div
            className={`bg-gray-900 border border-gray-600 overflow-hidden flex flex-col h-full ${className || ''}`}
            style={borderStyle}
        >
            {image && (
                <div className="relative h-64 overflow-hidden group">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        {...imageProps}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                </div>
            )}

            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-3xl font-pixel text-white mb-2 uppercase text-glow-white leading-none">
                    {title}
                </h3>

                {subtitle && (
                    <p className="text-rodetes-pink font-pixel text-xl mb-4">{subtitle}</p>
                )}

                <div className="text-gray-300 font-pixel text-lg flex-1">
                    {children}
                </div>

                {footer && (
                    <div className="mt-6 pt-4 border-t border-gray-800">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Card;
