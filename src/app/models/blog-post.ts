import { User } from './user';
import { Comment } from './comment';

export interface BlogPost {
    id?: number;
    title: string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
    auteur?: User;
    likes?: number;
    comments?: Comment[];
    image?: string;
} 