import { Role } from './enums/role';
import { BlogPost } from './blog-post';

export interface User {
    id?: number;
    userName: string;
    password?: string;
    fullName: string;
    email: string;
    profilePic?: string;
    role: Role;
    address: string;
    city: string;
    blogSpots?: BlogPost[];
    isValid?: boolean;
}
