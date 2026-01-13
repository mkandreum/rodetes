import { useState } from 'react';
import Button from '../common/Button';
import { useSaleMutations } from '../../hooks/useSales';
import { useToast } from '../../context/ToastContext';
import { MerchItem } from '@rodetes/types';

interface PurchaseFormProps {
    item: MerchItem;
    onClose: () => void;
}

const PurchaseForm: React.FC<PurchaseFormProps> = ({ item, onClose }) => {
    const { createSale } = useSaleMutations();
    const { success, error } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        surname: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createSale.mutateAsync({
                merch_item_id: item.id,
                drag_id: item.drag_id, // Might be null for general merch
                buyer_name: formData.name,
                buyer_surname: formData.surname
            });
            success('¡Compra realizada con éxito!');
            onClose();
        } catch (err) {
            console.error(err);
            error('Error al realizar la compra');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-6">
                <img src={item.image_url} alt={item.name} className="w-full h-48 object-cover rounded border border-gray-700 mb-4" />
                <h4 className="text-xl font-bold">{item.name}</h4>
                <p className="text-2xl text-rodetes-pink font-bold">{item.price} €</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-gray-400 text-sm mb-1">Nombre</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-black border border-gray-700 text-white p-2 focus:border-rodetes-pink outline-none"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-gray-400 text-sm mb-1">Apellidos</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-black border border-gray-700 text-white p-2 focus:border-rodetes-pink outline-none"
                        value={formData.surname}
                        onChange={e => setFormData({ ...formData, surname: e.target.value })}
                    />
                </div>
            </div>

            <Button
                type="submit"
                className="w-full bg-rodetes-pink hover:bg-pink-600 text-white border-none mt-6"
                disabled={createSale.isPending}
            >
                {createSale.isPending ? 'PROCESANDO...' : 'CONFIRMAR COMPRA'}
            </Button>
        </form>
    );
};

export default PurchaseForm;
