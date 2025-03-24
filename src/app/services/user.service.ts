import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl  = "http://localhost:8082/user";

  constructor(private http: HttpClient,private authService:AuthService) { }
  private getHeaders() {
          const token = this.authService.getToken();
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
          return headers;
        }
  getUsers():Observable<User[]>{
    return this.http.get<User[]>(this.apiUrl + "/all")
  }

  getUserById(id:number):Observable<User>{
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user:User):Observable<User>{
    return this.http.post<User>(this.apiUrl,user);
  }
  updateUser(id: number, user: User): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  uploadPhoto(formData:FormData): Observable<any> { 
    return this.http.patch(`${this.apiUrl}/user-upload`, formData, { headers: this.getHeaders() });
  }

}
