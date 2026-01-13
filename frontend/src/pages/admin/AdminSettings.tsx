import React, { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { Save } from 'lucide-react';

const AdminSettings = () => {
    const { settings, isLoading, updateSettings, isUpdating } = useSettings();
    const [formData, setFormData] = useState({
        appLogoUrl: '',
        ticketLogoUrl: '',
        bannerVideoUrl: '',
        promoEnabled: false,
        promoCustomText: '',
        promoNeonColor: '',
        allowedDomainsStr: ''
    });
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (settings) {
            setFormData({
                appLogoUrl: settings.appLogoUrl || '',
                ticketLogoUrl: settings.ticketLogoUrl || '',
                bannerVideoUrl: settings.bannerVideoUrl || '',
                promoEnabled: Boolean(settings.promoEnabled),
                promoCustomText: settings.promoCustomText || '',
                promoNeonColor: settings.promoNeonColor || '',
                allowedDomainsStr: Array.isArray(settings.allowedDomains)
                    ? settings.allowedDomains.join('\n')
                    : (settings.allowedDomains || '')
            });
        }
    }, [settings]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        try {
            // Process domains
            const allowedDomains = formData.allowedDomainsStr
                .split('\n')
                .map(d => d.trim())
                .filter(d => d.startsWith('@') || d.length > 0);

            await updateSettings({
                appLogoUrl: formData.appLogoUrl,
                ticketLogoUrl: formData.ticketLogoUrl,
                bannerVideoUrl: formData.bannerVideoUrl,
                promoEnabled: formData.promoEnabled,
                promoCustomText: formData.promoCustomText,
                promoNeonColor: formData.promoNeonColor,
                allowedDomains
            });

            setMessage({ text: 'Ajustes actualizados correctamente', type: 'success' });
        } catch (error) {
            console.error(error);
            setMessage({ text: 'Error al actualizar ajustes', type: 'error' });
        }
    };

    if (isLoading) return <Loader />;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-pixel text-white text-glow-white mb-6">AJUSTES GENERALES</h2>

            {message && (
                <div className={`p-4 mb-4 border ${message.type === 'success' ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'} bg-black font-pixel text-center`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-gray-900 p-6 border border-white space-y-8">

                {/* LOGOS */}
                <div>
                    <h4 className="text-2xl font-pixel text-white mb-4 text-glow-white border-b border-gray-700 pb-2">LOGOTIPOS</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-pixel text-lg text-gray-300 mb-1">LOGO PRINCIPAL (URL)</label>
                            <input
                                type="text"
                                value={formData.appLogoUrl}
                                onChange={e => setFormData({ ...formData, appLogoUrl: e.target.value })}
                                className="w-full bg-black border border-gray-600 text-white p-2 font-pixel"
                                placeholder="https://..."
                            />
                            <p className="text-xs text-gray-400">Recomendado PNG transparente.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-pixel text-lg text-gray-300 mb-1">LOGO TICKET (URL)</label>
                            <input
                                type="text"
                                value={formData.ticketLogoUrl}
                                onChange={e => setFormData({ ...formData, ticketLogoUrl: e.target.value })}
                                className="w-full bg-black border border-gray-600 text-white p-2 font-pixel"
                                placeholder="https://..."
                            />
                            <p className="text-xs text-gray-400">Aparecerá en el PDF de la entrada.</p>
                        </div>
                    </div>
                </div>

                {/* BANNER */}
                <div>
                    <h4 className="text-2xl font-pixel text-white mb-4 text-glow-white border-b border-gray-700 pb-2">BANNER INICIO</h4>
                    <div className="space-y-2">
                        <label className="block text-sm font-pixel text-lg text-gray-300 mb-1">BANNER (Imagen o Video URL)</label>
                        <input
                            type="text"
                            value={formData.bannerVideoUrl}
                            onChange={e => setFormData({ ...formData, bannerVideoUrl: e.target.value })}
                            className="w-full bg-black border border-gray-600 text-white p-2 font-pixel"
                            placeholder="https://..."
                        />
                    </div>
                </div>

                {/* PROMO */}
                <div>
                    <h4 className="text-2xl font-pixel text-white mb-4 text-glow-white border-b border-gray-700 pb-2">PROMO HEADER</h4>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="promoEnabled"
                                checked={formData.promoEnabled}
                                onChange={e => setFormData({ ...formData, promoEnabled: e.target.checked })}
                                className="mr-3 h-5 w-5 bg-black border-gray-600"
                            />
                            <label htmlFor="promoEnabled" className="text-sm font-pixel text-lg text-gray-300">ACTIVAR BANNER PROMO</label>
                        </div>
                        <div>
                            <label className="block text-sm font-pixel text-lg text-gray-300 mb-1">TEXTO</label>
                            <input
                                type="text"
                                value={formData.promoCustomText}
                                onChange={e => setFormData({ ...formData, promoCustomText: e.target.value })}
                                className="w-full bg-black border border-gray-600 text-white p-2 font-pixel"
                                placeholder="¡PRÓXIMO: {eventName}! 🔥 {eventDate}"
                            />
                            <p className="text-xs text-gray-400 mt-1">Placeholders: {`{eventName}`}, {`{eventDate}`}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-pixel text-lg text-gray-300 mb-1">COLOR NEÓN (HEX)</label>
                            <input
                                type="text"
                                value={formData.promoNeonColor}
                                onChange={e => setFormData({ ...formData, promoNeonColor: e.target.value })}
                                className="w-full bg-black border border-gray-600 text-white p-2 font-pixel"
                                placeholder="#F02D7D"
                            />
                        </div>
                    </div>
                </div>

                {/* DOMINIOS */}
                <div>
                    <h4 className="text-2xl font-pixel text-white mb-4 text-glow-white border-b border-gray-700 pb-2">DOMINIOS EMAIL PERMITIDOS</h4>
                    <div className="space-y-2">
                        <label className="block text-sm font-pixel text-lg text-gray-300 mb-1">LISTA (Uno por línea)</label>
                        <textarea
                            rows={5}
                            value={formData.allowedDomainsStr}
                            onChange={e => setFormData({ ...formData, allowedDomainsStr: e.target.value })}
                            className="w-full bg-black border border-gray-600 text-white p-2 font-pixel"
                            placeholder="@gmail.com&#10;@hotmail.com"
                        />
                        <p className="text-xs text-gray-400">Si está vacío, se permiten todos.</p>
                    </div>
                </div>

                <Button type="submit" className="w-full" disabled={isUpdating}>
                    <Save size={20} className="mr-2" />
                    {isUpdating ? 'GUARDANDO...' : 'GUARDAR AJUSTES'}
                </Button>
            </form>
        </div>
    );
};

export default AdminSettings;
