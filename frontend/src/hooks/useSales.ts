import { useQuery } from '@tanstack/react-query';
import client from '../api/client';
import { Sale } from '../types';

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
