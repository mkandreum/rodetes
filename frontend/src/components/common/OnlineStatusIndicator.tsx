import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff, Wifi } from 'lucide-react';

export const OnlineStatusIndicator: React.FC = () => {
    const { isOnline, wasOffline } = useOnlineStatus();

    if (isOnline && !wasOffline) {
        return null; // Don't show anything if always online
    }

    return (
        <div
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 rounded-full font-pixel text-sm transition-all duration-300 ${isOnline
                    ? 'bg-green-600 text-white'
                    : 'bg-red-600 text-white'
                }`}
            style={{
                boxShadow: isOnline
                    ? '0 0 15px rgba(34, 197, 94, 0.5)'
                    : '0 0 15px rgba(239, 68, 68, 0.5)'
            }}
        >
            <div className="flex items-center gap-2">
                {isOnline ? (
                    <>
                        <Wifi size={16} />
                        <span>Conexión restaurada</span>
                    </>
                ) : (
                    <>
                        <WifiOff size={16} />
                        <span>Sin conexión</span>
                    </>
                )}
            </div>
        </div>
    );
};
