import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class ProviderService {

      private apiUrl = "http://localhost:8082/provider"
      constructor(private http:HttpClient,private authService:AuthService) { }
  
  
      private getHeaders() {
        const token = this.authService.getToken();
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return headers;
      }
      getUsers():Observable<User[]>{
        return this.http.get<User[]>(this.apiUrl + "/get", { headers: this.getHeaders() })
      }
    
      getUserById(id:number):Observable<User>{
        return this.http.get<User>(`${this.apiUrl}/${id}`,{headers:this.getHeaders()});
      }
    
      createUser(user:User):Observable<User>{
        return this.http.post<User>(this.apiUrl,user,{headers:this.getHeaders()});
      }
      updateUser(id: number, user: User): Observable<User> {
        return this.http.patch<User>(`${this.apiUrl}/${id}`, user,{headers:this.getHeaders()});
      }
    
      deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`,{headers:this.getHeaders()});
      }
}
