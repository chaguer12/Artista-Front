import { Injectable } from '@angular/core';
import { BehaviorSubject,Observable } from 'rxjs';
import { catchError } from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private jwtHelper = new JwtHelperService();
  private authUrl = "http://localhost:8082/auth/log-in";
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    this.loadToken();
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post(this.authUrl, { email, password })
      .pipe(
        catchError(error => {
          throw error;
        })
      );
  }
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.tokenSubject.next(token);
  }
  loadToken(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.tokenSubject.next(token);
    }
  }
  logout(): void {
    localStorage.removeItem('authToken');
    this.tokenSubject.next(null);
  }
  isLoggedIn(): boolean {
    return this.tokenSubject.value !== null;
  }
  getToken(): string | null {
    return this.tokenSubject.value;
  }
  getUserRole():string | null {
    const token = this.getToken();
    if(token){
      const decodedToken = this.jwtHelper.decodeToken(token);
      console.log(decodedToken);
      return decodedToken?.role || null;
    }
    return null;
  }
}
