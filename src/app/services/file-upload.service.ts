import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private apiUrl = 'http://localhost:8082/upload';

  constructor(private http: HttpClient,private authService:AuthService) { }
  private getHeaders() {
            const token = this.authService.getToken();
            const headers = new HttpHeaders({
              'Authorization': `Bearer ${token}`
            });
            return headers;
          }
          upload(formData: FormData): Observable<HttpEvent<any>> {
            return this.http.post<any>(`${this.apiUrl}`, formData, {
              reportProgress: true,
              observe: 'events',
              headers: this.getHeaders()
            });
          }

  getFiles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/files`);
  }
} 