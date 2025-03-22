import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Studio } from '../models/studio';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StudioService {
  private apiUrl = 'http://localhost:8082/studio';

  constructor(private http: HttpClient,private authService:AuthService) { }
   getHeaders() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return headers;
  }

  getAllStudios(): Observable<Studio[]> {
    const headers = this.getHeaders();
    return this.http.get<Studio[]>(this.apiUrl,{headers});
  }

  getStudioById(id: number): Observable<Studio> {
    return this.http.get<Studio>(`${this.apiUrl}/${id}`);
  }

  createStudio(studio: Studio): Observable<Studio> {
    const headers = this.getHeaders();
    console.log("Headers being sent:", headers);
    return this.http.post<Studio>(this.apiUrl + "/add", studio,{headers});
  }

  updateStudio(id: number, studio: Studio): Observable<Studio> {
    return this.http.put<Studio>(`${this.apiUrl}/${id}`, studio);
  }

  deleteStudio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getStudiosByOwner(ownerId: number): Observable<Studio[]> {
    return this.http.get<Studio[]>(`${this.apiUrl}/owner/${ownerId}`);
  }

  addEquipmentToStudio(studioId: number, equipmentId: number): Observable<Studio> {
    return this.http.post<Studio>(`${this.apiUrl}/${studioId}/equipment/${equipmentId}`, {});
  }

  removeEquipmentFromStudio(studioId: number, equipmentId: number): Observable<Studio> {
    return this.http.delete<Studio>(`${this.apiUrl}/${studioId}/equipment/${equipmentId}`);
  }
} 