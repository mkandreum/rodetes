import { useState } from 'react';
import { useMerch } from '../hooks/useMerch';
import { useDrags } from '../hooks/useDrags';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

const Merch = () => {
    // Fetch Web Merch (dragId: null is handled by backend logic or filtering)
    const { data: allMerch, isLoading: mechLoading } = useMerch();
    const { data: drags, isLoading: dragsLoading } = useDrags();

    const [selectedItem, setSelectedItem] = useState<any | null>(null);

    if (mechLoading || dragsLoading) return <Loader />;

    // Filter items client side since we fetch all at once usually, or could use multiple hooks
    const webMerch = allMerch?.filter(item => !item.drag_id) || [];

    // Group drag merch
    const dragsWithMerch = drags?.map(drag => ({
        ...drag,
        items: allMerch?.filter(item => item.drag_id === drag.id) || []
    })).filter(drag => drag.items.length > 0) || [];

    return (
        <div className="space-y-16">
            <div className="text-center">
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 text-glow-white">TIENDA OFICIAL</h2>
                <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto px-4">
                    Llévate un recuerdo de Rodetes o apoya a tus drags favoritas.
                </p>
            </div>

            {/* WEB MERCH SECTION */}
            {webMerch.length > 0 && (
                <section>
                    <h3 className="text-3xl font-pixel text-rodetes-pink mb-8 border-b border-gray-800 pb-2">
                        RODETES COLLECTION
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                        {webMerch.map(item => (
                            <Card
                                key={item.id}
                                title={item.name}
                                subtitle={`${item.price} €`}
                                image={item.image_url}
                                imageProps={{ loading: 'lazy' }}
                            >
                                <Button
                                    className="w-full mt-4 bg-white text-black hover:bg-rodetes-pink hover:text-white border-none touch-feedback text-sm sm:text-base"
                                    onClick={() => setSelectedItem(item)}
                                >
                                    COMPRAR
                                </Button>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* DRAGS MERCH SECTION */}
            {dragsWithMerch.map(drag => (
                <section key={drag.id}>
                    <h3
                        className="text-3xl font-pixel text-white mb-8 border-b border-gray-800 pb-2 flex items-center gap-4"
                        style={{ color: drag.card_color }}
                    >
                        {drag.name.toUpperCase()} COLLECTION
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                        {drag.items.map(item => (
                            <Card
                                key={item.id}
                                title={item.name}
                                subtitle={`${item.price} €`}
                                image={item.image_url}
                                imageProps={{ loading: 'lazy' }}
                                color={drag.card_color}
                            >
                                <div className="mt-4">
                                    <Button
                                        className="w-full text-black hover:text-white border-none touch-feedback text-sm sm:text-base"
                                        style={{ backgroundColor: drag.card_color || '#fff' }}
                                        onClick={() => setSelectedItem(item)}
                                    >
                                        COMPRAR
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>
            ))}

            {/* PURCHASE MODAL (Mockup) */}
            <Modal
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                title={selectedItem?.name}
            >
                <div className="text-center space-y-6">
                    <img src={selectedItem?.image_url} alt={selectedItem?.name} loading="lazy" className="w-full h-48 sm:h-64 object-cover border border-gray-600" />

                    <div>
                        <p className="text-gray-300">Estás a punto de comprar:</p>
                        <h4 className="text-2xl font-bold text-white">{selectedItem?.name}</h4>
                        <p className="text-rodetes-pink text-3xl font-bold mt-2">{selectedItem?.price} €</p>
                    </div>

                    <p className="text-sm text-gray-400 bg-gray-800 p-4 border border-gray-700">
                        ⚠️ En esta versión demo, el sistema de pagos no está activo.
                        <br />Esta ventana es una demostración del flujo de compra.
                    </p>

                    <Button className="w-full bg-green-600 hover:bg-green-500 text-white border-none touch-feedback">
                        CONTINUAR AL PAGO
                    </Button>
                </div>
            </Modal>

        </div>
    );
};

export default Merch;
