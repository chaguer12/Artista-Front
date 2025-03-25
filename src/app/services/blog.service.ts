import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlogPost } from '../models/blog-post';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'http://localhost:8082/blog';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAllPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getPostById(id: number): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createPost(post: BlogPost): Observable<BlogPost> {
    return this.http.post<BlogPost>(`${this.apiUrl}/add`, post, { headers: this.getHeaders() });
  }

  updatePost(id: number, post: BlogPost): Observable<BlogPost> {
    return this.http.put<BlogPost>(`${this.apiUrl}/${id}`, post, { headers: this.getHeaders() });
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  upvotePost(id: number): Observable<BlogPost> {
    return this.http.post<BlogPost>(`${this.apiUrl}/${id}/upvote`, {}, { headers: this.getHeaders() });
  }

  downvotePost(id: number): Observable<BlogPost> {
    return this.http.post<BlogPost>(`${this.apiUrl}/${id}/downvote`, {}, { headers: this.getHeaders() });
  }

  uploadImage(postId: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/${postId}/image`, formData, { headers: this.getHeaders() });
  }

  getPostsByUser(userId: number): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() });
  }
}
