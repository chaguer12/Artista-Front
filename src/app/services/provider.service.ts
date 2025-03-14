import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  private apiUrl = "http://localhost:8082/provider"
  constructor(private http:HttpClient) { }

  
    
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
}
