export interface Equipment {
    id?: number;
    name: string;
    type: string;
    brand: string;
    status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE';
    studioId?: number;
    image?: string;
    description?: string;
} 