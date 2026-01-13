export interface Event {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    price: number;
    ticket_availability: number;
    poster_url: string;
    is_visible: boolean;
    galleryImages?: string[];
    created_at?: string;
}

export interface Drag {
    id: number;
    name: string;
    description: string;
    instagram: string;
    cover_image_url: string;
    card_color: string;
    merch?: {
        id: number;
        name: string;
        price: number;
        image_url: string;
    }[];
}

export interface MerchItem {
    id: number;
    drag_id: number | null;
    name: string;
    price: number;
    image_url: string;
}

export interface Ticket {
    id: number;
    ticket_id: string; // QR content
    event_id: number;
    event_title?: string;
    email: string;
    name: string;
    surname: string;
    quantity: number;
    is_scanned: boolean;
    scanned_at?: string;
}

export interface Sale {
    id: number;
    sale_id: string;
    merch_item_id: number;
    item_name?: string;
    price?: number;
    drag_id: number | null;
    drag_name?: string;
    drag_owner?: string;
    buyer_name: string;
    buyer_surname: string;
    is_delivered: boolean;
    delivered_at?: string;
    created_at: string;
}
