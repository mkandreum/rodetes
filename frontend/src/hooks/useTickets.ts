import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { Ticket } from '../types';

interface CreateTicketData {
    event_id: number;
    email: string;
    name: string;
    surname: string;
    quantity: number;
}

interface ScanResult {
    success: boolean;
    message: string;
    ticket?: Ticket;
}

export const useTickets = () => {
    return useQuery({
        queryKey: ['tickets'],
        queryFn: async () => {
            const { data } = await api.get<Ticket[]>('/tickets');
            return data;
        },
    });
};

export const useTicketMutations = () => {
    const queryClient = useQueryClient();

    const createTicket = useMutation({
        mutationFn: (data: CreateTicketData) => api.post<{ success: boolean; tickets: Ticket[] }>('/tickets', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] }); // To update availability if tracked
        },
    });

    const scanTicket = useMutation({
        mutationFn: (ticket_id: string) => api.post<ScanResult>('/tickets/scan', { ticket_id }),
    });

    return { createTicket, scanTicket };
};
