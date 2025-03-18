export interface Profile {
    id?: number;
    userName: string;
    email: string;
    fullName: string;
    phoneNumber?: string;
    address: string;
    city: string;
    bio?: string;
    profilePic?: string;
    role: 'ARTIST' | 'PROVIDER' | 'ADMIN';
    socialLinks?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        soundcloud?: string;
    };
    isValid: boolean;
} 