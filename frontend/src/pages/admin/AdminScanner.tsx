import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../../api/client';
import Button from '../../components/common/Button';
import { CheckCircle, XCircle } from 'lucide-react';

const AdminScanner = () => {
    const [scanResult, setScanResult] = useState<any>(null);
    const [scanError, setScanError] = useState<string | null>(null);
    const [manualCode, setManualCode] = useState('');

    useEffect(() => {
        // Only init scanner if we don't have a result currently showing
        if (scanResult) return;

        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
        );

        scanner.render(onScanSuccess, onScanFailure);

        function onScanSuccess(decodedText: string) {
            handleValidate(decodedText);
            scanner.clear().catch(err => console.error("Failed to clear scanner", err));
        }

        function onScanFailure() {
            // console.warn(`Code scan error = ${error}`);
        }

        return () => {
            scanner.clear().catch(error => console.error("Failed to clean up scanner", error));
        };
    }, [scanResult]);

    const handleValidate = async (code: string) => {
        setScanError(null);
        setScanResult(null);

        try {
            const { data } = await api.post('/tickets/scan', { ticket_id: code });
            setScanResult(data);
        } catch (error: any) {
            setScanError(error.response?.data?.message || 'Error al validar entrada');
            if (error.response?.data?.ticket) {
                // If backend returns ticket info even on error (e.g. "Already scanned")
                setScanResult({ ...error.response.data, success: false });
            }
        }
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualCode) handleValidate(manualCode);
    };

    const resetScanner = () => {
        setScanResult(null);
        setScanError(null);
        setManualCode('');
    };

    return (
        <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-8">Escáner de Entradas</h2>

            {!scanResult && !scanError && (
                <div className="space-y-8">
                    <div id="reader" className="bg-white p-4 rounded-lg overflow-hidden"></div>

                    <div className="border-t border-gray-700 pt-8">
                        <p className="text-gray-400 mb-4">O introduce el código manualmente:</p>
                        <form onSubmit={handleManualSubmit} className="flex gap-2 justify-center">
                            <input
                                type="text"
                                value={manualCode}
                                onChange={(e) => setManualCode(e.target.value)}
                                className="bg-black border border-gray-700 text-white p-2 w-full max-w-xs"
                                placeholder="ID de Entrada"
                            />
                            <Button type="submit">VALIDAR</Button>
                        </form>
                    </div>
                </div>
            )}

            {(scanResult || scanError) && (
                <div className={`p-8 border rounded-lg ${scanResult?.success ? 'bg-green-900/30 border-green-500' : 'bg-red-900/30 border-red-500'}`}>
                    {scanResult?.success ? (
                        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                    ) : (
                        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                    )}

                    <h3 className="text-2xl font-bold text-white mb-2">
                        {scanResult?.success ? 'ENTRADA VÁLIDA' : 'ENTRADA INVÁLIDA'}
                    </h3>

                    <p className="text-xl mb-6">
                        {scanResult?.message || scanError}
                    </p>

                    {scanResult?.ticket && (
                        <div className="bg-black/50 p-4 rounded text-left mb-6 max-w-sm mx-auto space-y-2">
                            <p><span className="text-gray-400">Evento:</span> <span className="text-white font-bold">{scanResult.ticket.event_title}</span></p>
                            <p><span className="text-gray-400">Titular:</span> <span className="text-white">{scanResult.ticket.name} {scanResult.ticket.surname}</span></p>
                            <p><span className="text-gray-400">Email:</span> <span className="text-gray-300">{scanResult.ticket.email}</span></p>
                            <p><span className="text-gray-400">ID:</span> <span className="font-mono text-xs">{scanResult.ticket.ticket_id}</span></p>
                        </div>
                    )}

                    <Button onClick={resetScanner}>ESCANEAR OTRA</Button>
                </div>
            )}
        </div>
    );
};

export default AdminScanner;
