import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipment } from '../models/equipment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
  private apiUrl = 'http://localhost:8082/equipment';

  constructor(private http: HttpClient,private authService:AuthService) { }

        private getHeaders() {
          const token = this.authService.getToken();
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
          });
          return headers;
        }

  getAllEquipment(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getEquipmentById(id: number): Observable<Equipment> {
    return this.http.get<Equipment>(`${this.apiUrl}/${id}`);
  }

  createEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.post<Equipment>(this.apiUrl + "/add", equipment, { headers: this.getHeaders() });
  }

  updateEquipment(id: number, equipment: Equipment): Observable<Equipment> {
    return this.http.patch<Equipment>(`${this.apiUrl}/${id}`, equipment);
  }

  deleteEquipment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`,{headers:this.getHeaders()});
  }

  getEquipmentByStudio(studioId: number): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(`${this.apiUrl}/studio/${studioId}`);
  }
  uploadPhoto(formData:FormData): Observable<any> { 
    return this.http.patch(`${this.apiUrl}/equipmentm-upload`, formData, { headers: this.getHeaders() });
  }
} 