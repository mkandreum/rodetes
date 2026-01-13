import React, { useEffect } from 'react';
import { X } from 'lucide-react'; // Need to make sure lucide-react is installed or use SVG

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
}

const Modal = ({ isOpen, onClose, title, children, className }: ModalProps) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Content */}
            <div className={`relative bg-gray-900 border border-gray-600 w-full max-w-2xl max-h-[90vh] overflow-y-auto ${className || ''}`}>
                <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gray-800/50">
                    <h3 className="text-2xl font-pixel text-white text-glow-white">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
