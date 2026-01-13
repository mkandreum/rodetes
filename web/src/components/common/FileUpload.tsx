import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
    label: string;
    currentUrl?: string;
    onUpload: (file: File) => Promise<void>;
    accept?: string;
    maxSize?: number; // in MB
}

const FileUpload: React.FC<FileUploadProps> = ({
    label,
    currentUrl,
    onUpload,
    accept = 'image/*',
    maxSize = 5
}) => {
    const [preview, setPreview] = useState<string | null>(currentUrl || null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        setError(null);

        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
            setError(`File size must be less than ${maxSize}MB`);
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Only image files are allowed');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload file
        setIsUploading(true);
        try {
            await onUpload(file);
        } catch (err: any) {
            setError(err.message || 'Upload failed');
            setPreview(currentUrl || null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleClear = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-pixel text-gray-300">{label}</label>

            <div
                className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${isDragging
                    ? 'border-rodetes-pink bg-rodetes-pink/10'
                    : 'border-gray-600 hover:border-gray-500'
                    } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                {preview ? (
                    <div className="relative">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-48 object-contain rounded"
                        />
                        <button
                            onClick={handleClear}
                            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                            type="button"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                        <p className="text-gray-400 mb-2">
                            Drag & drop an image here, or click to select
                        </p>
                        <p className="text-xs text-gray-500">
                            Max size: {maxSize}MB
                        </p>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
            </div>

            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}

            {isUploading && (
                <p className="text-rodetes-blue text-sm">Uploading...</p>
            )}
        </div>
    );
};

export default FileUpload;
