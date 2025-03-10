import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl  = "http://localhost:8082/user";

  constructor(private http: HttpClient) { }

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
