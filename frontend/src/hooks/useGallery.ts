import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

export interface GalleryPhoto {
    id: number;
    event_id: number;
    image_url: string;
    event_title: string;
    event_date: string;
}

export const useGallery = () => {
    return useQuery({
        queryKey: ['gallery'],
        queryFn: async () => {
            const { data } = await api.get<GalleryPhoto[]>('/gallery');
            return data;
        },
    });
};

export const useGalleryMutations = () => {
    const queryClient = useQueryClient();

    const addPhoto = useMutation({
        mutationFn: (data: FormData) => api.post('/gallery', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gallery'] });
        },
    });

    const deletePhoto = useMutation({
        mutationFn: (id: number) => api.delete(`/gallery/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gallery'] });
        },
    });

    return { addPhoto, deletePhoto };
};
