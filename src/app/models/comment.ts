import { User } from './user';
import { BlogPost } from './blog-post';

export interface Comment {
    id?: number;
    content: string;
    createdAt?: Date;
    author?: User;
    blogPost?: BlogPost;
} 