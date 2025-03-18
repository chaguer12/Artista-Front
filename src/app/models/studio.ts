export interface Studio {
    id?: number;
    name: string;
    location: string;
    description?: string;
    image?: string;
    hourlyRate?: number;
    availability: 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE';
    equipmentIds?: number[];
    ownerId?: number;
} 