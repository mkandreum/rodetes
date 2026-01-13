import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from '../api/client';
import { Sale } from '@rodetes/types';

const fetchSales = async (): Promise<Sale[]> => {
    const { data } = await client.get('/sales');
    return data;
};

export const useSales = () => {
    return useQuery({
        queryKey: ['sales'],
        queryFn: fetchSales,
        staleTime: 1000 * 60, // 1 minute
    });
};

export const useSaleMutations = () => {
    const queryClient = useQueryClient();

    const createSale = useMutation({
        mutationFn: (saleData: { merch_item_id: number; drag_id?: number | null; buyer_name: string; buyer_surname: string }) =>
            client.post('/sales', saleData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sales'] });
        },
    });

    return { createSale };
};
