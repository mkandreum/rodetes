import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { MerchItem } from '../types';

// Fetch all merch (optionally filtered by filters object)
export const useMerch = (filters?: { type?: 'web'; dragId?: number }) => {
    return useQuery({
        queryKey: ['merch', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters?.type) params.append('type', filters.type);
            if (filters?.dragId) params.append('dragId', String(filters.dragId));

            const { data } = await api.get<MerchItem[]>(`/merch?${params.toString()}`);
            return data;
        },
    });
};

export const useMerchMutations = () => {
    const queryClient = useQueryClient();

    const createMerch = useMutation({
        mutationFn: (newItem: Partial<MerchItem>) => api.post('/merch', newItem),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['merch'] });
        },
    });

    const updateMerch = useMutation({
        mutationFn: ({ id, ...data }: Partial<MerchItem> & { id: number }) =>
            api.put(`/merch/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['merch'] });
        },
    });

    const deleteMerch = useMutation({
        mutationFn: (id: number) => api.delete(`/merch/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['merch'] });
        },
    });

    return { createMerch, updateMerch, deleteMerch };
};
