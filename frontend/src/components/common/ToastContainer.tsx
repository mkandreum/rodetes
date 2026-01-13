import { useToast } from '../../context/ToastContext';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 50, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        layout
                        className={`pointer-events-auto min-w-[300px] border border-gray-700 bg-black/90 backdrop-blur-md text-white p-4 shadow-lg shadow-black/50 flex items-start gap-3 rounded-none font-pixel relative group ${toast.type === 'success' ? 'border-l-4 border-l-rodetes-pink' :
                            toast.type === 'error' ? 'border-l-4 border-l-red-500' :
                                'border-l-4 border-l-rodetes-blue'
                            }`}
                    >
                        <div className="mt-1">
                            {toast.type === 'success' && <CheckCircle size={20} className="text-rodetes-pink" />}
                            {toast.type === 'error' && <AlertCircle size={20} className="text-red-500" />}
                            {toast.type === 'info' && <Info size={20} className="text-rodetes-blue" />}
                        </div>
                        <div className="flex-1">
                            {/* <h4 className="font-bold text-sm uppercase mb-1">{toast.type}</h4> */}
                            <p className="text-gray-200 text-lg leading-tight">{toast.message}</p>
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-white"
                        >
                            <X size={18} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ToastContainer;
