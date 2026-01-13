import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { Drag } from '../types';

export const useDrags = () => {
    return useQuery({
        queryKey: ['drags'],
        queryFn: async () => {
            const { data } = await api.get<Drag[]>('/drags');
            return data;
        },
    });
};

export const useDragMutations = () => {
    const queryClient = useQueryClient();

    const createDrag = useMutation({
        mutationFn: (newDrag: Partial<Drag>) => api.post('/drags', newDrag),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['drags'] });
        },
    });

    const updateDrag = useMutation({
        mutationFn: ({ id, ...data }: Partial<Drag> & { id: number }) =>
            api.put(`/drags/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['drags'] });
        },
    });

    const deleteDrag = useMutation({
        mutationFn: (id: number) => api.delete(`/drags/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['drags'] });
        },
    });

    return { createDrag, updateDrag, deleteDrag };
};
