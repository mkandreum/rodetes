import React, { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';
import { useInstallPrompt } from '../../hooks/useInstallPrompt';
import Button from './Button';

export const InstallPrompt: React.FC = () => {
    const { isInstallable, promptInstall } = useInstallPrompt();
    const [showPrompt, setShowPrompt] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Check if user has dismissed before
        const hasBeenDismissed = localStorage.getItem('pwa-install-dismissed');

        if (hasBeenDismissed) {
            setDismissed(true);
            return;
        }

        // Show prompt after 10 seconds if installable
        if (isInstallable && !dismissed) {
            const timer = setTimeout(() => {
                setShowPrompt(true);
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [isInstallable, dismissed]);

    const handleInstall = async () => {
        const installed = await promptInstall();
        if (installed || !installed) {
            setShowPrompt(false);
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        setDismissed(true);
        localStorage.setItem('pwa-install-dismissed', 'true');
    };

    if (!showPrompt || !isInstallable) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-[100] animate-slide-up">
            <div
                className="bg-black border-2 border-rodetes-pink p-4 md:p-6 shadow-[0_0_20px_rgba(235,46,255,0.5)]"
                style={{
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.98) 0%, rgba(235,46,255,0.1) 100%)'
                }}
            >
                <button
                    onClick={handleDismiss}
                    className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
                    aria-label="Cerrar"
                >
                    <X size={20} />
                </button>

                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-rodetes-pink rounded-lg flex items-center justify-center">
                        <Download className="text-white" size={24} />
                    </div>

                    <div className="flex-1">
                        <h3 className="text-white font-pixel text-lg mb-2">
                            Instala Rodetes Party
                        </h3>
                        <p className="text-gray-300 text-sm mb-4">
                            Accede más rápido y disfruta de una mejor experiencia
                        </p>

                        <div className="flex gap-2">
                            <Button
                                variant="neon"
                                size="sm"
                                onClick={handleInstall}
                                className="flex-1"
                            >
                                INSTALAR
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDismiss}
                                className="px-3"
                            >
                                Ahora no
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
