import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Studio } from '../models/studio';

@Injectable({
  providedIn: 'root'
})
export class StudioService {
  private apiUrl = 'http://localhost:8080/studios';

  constructor(private http: HttpClient) { }

  getAllStudios(): Observable<Studio[]> {
    return this.http.get<Studio[]>(this.apiUrl);
  }

  getStudioById(id: number): Observable<Studio> {
    return this.http.get<Studio>(`${this.apiUrl}/${id}`);
  }

  createStudio(studio: Studio): Observable<Studio> {
    return this.http.post<Studio>(this.apiUrl, studio);
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