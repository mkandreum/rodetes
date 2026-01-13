import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { Event } from '@rodetes/types';

// Fetch Public Events
export const usePublicEvents = () => {
    return useQuery({
        queryKey: ['events', 'public'],
        queryFn: async () => {
            const { data } = await api.get<Event[]>('/events');
            return data;
        },
    });
};

// Fetch All Events (Admin)
export const useAdminEvents = () => {
    return useQuery({
        queryKey: ['events', 'admin'],
        queryFn: async () => {
            const { data } = await api.get<Event[]>('/events/admin/all');
            return data;
        },
    });
};

// Mutations (Create, Update, Delete)
export const useEventMutations = () => {
    const queryClient = useQueryClient();

    const createEvent = useMutation({
        mutationFn: (newEvent: Partial<Event>) => api.post('/events', newEvent),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });

    const updateEvent = useMutation({
        mutationFn: ({ id, ...data }: Partial<Event> & { id: number }) =>
            api.put(`/events/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });

    const deleteEvent = useMutation({
        mutationFn: (id: number) => api.delete(`/events/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });

    return { createEvent, updateEvent, deleteEvent };
};
