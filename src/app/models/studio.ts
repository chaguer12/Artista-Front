export interface Studio {
    id?: number;
    name: string;
    address: string;
    city:string;
    description?: string;
    image?: string;
    hourlyRate?: number;
    availability: 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE';
    equipmentIds?: number[];
    ownerId?: number;
    email:string;
} 