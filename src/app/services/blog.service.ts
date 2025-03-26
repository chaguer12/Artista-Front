import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlogPost } from '../models/blog-post';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private readonly apiUrl = 'http://localhost:8082/blog';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
  }

  getAllPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`${this.apiUrl}/blog`, { headers: this.getHeaders() });
  }

  getPostById(id: number): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.apiUrl}/blog/${id}`, { headers: this.getHeaders() });
  }

  createPost(formData: FormData): Observable<BlogPost> {
    return this.http.post<BlogPost>(`${this.apiUrl}/blog`, formData, { headers: this.getHeaders() });
  }

  updatePost(id: number, post: BlogPost): Observable<BlogPost> {
    return this.http.put<BlogPost>(`${this.apiUrl}/blog/${id}`, post, { headers: this.getHeaders() });
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/blog/${id}`, { headers: this.getHeaders() });
  }

  upvotePost(id: number): Observable<BlogPost> {
    return this.http.post<BlogPost>(`${this.apiUrl}/blog/${id}/upvote`, {}, { headers: this.getHeaders() });
  }

  downvotePost(id: number): Observable<BlogPost> {
    return this.http.post<BlogPost>(`${this.apiUrl}/blog/${id}/downvote`, {}, { headers: this.getHeaders() });
  }

  uploadImage(postId: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/blog/${postId}/image`, formData, { headers: this.getHeaders() });
  }

  getPostsByUserId(userId: number): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`${this.apiUrl}/blog/user/${userId}`, { headers: this.getHeaders() });
  }
}
