import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from '../api/client';

export interface Settings {
    appLogoUrl?: string;
    ticketLogoUrl?: string;
    bannerVideoUrl?: string;
    promoEnabled?: boolean;
    promoCustomText?: string;
    promoNeonColor?: string;
    allowedDomains?: string[]; // Stored as JSON string in DB usually, but handled by controller
    [key: string]: any;
}

// Fetch all settings
const fetchSettings = async (): Promise<Settings> => {
    const { data } = await client.get('/settings');
    return data;
};

// Update a single setting
const updateSetting = async ({ key, value }: { key: string; value: any }) => {
    const { data } = await client.post('/settings', { key, value });
    return data;
};

// Update multiple settings
const updateSettings = async (settings: Partial<Settings>) => {
    const { data } = await client.put('/settings', settings);
    return data;
};

export const useSettings = () => {
    const queryClient = useQueryClient();

    const { data: settings, isLoading, error } = useQuery({
        queryKey: ['settings'],
        queryFn: fetchSettings,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const mutation = useMutation({
        mutationFn: updateSettings,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings'] });
        },
    });

    const updateSingle = useMutation({
        mutationFn: updateSetting,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings'] });
        },
    });

    return {
        settings,
        isLoading,
        error,
        updateSettings: mutation.mutateAsync,
        updateSetting: updateSingle.mutateAsync,
        isUpdating: mutation.isPending || updateSingle.isPending,
    };
};
