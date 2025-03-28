import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class  AuthService {
  private readonly API_URL = 'http://localhost:8082';
  private readonly jwtHelper = new JwtHelperService();
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private refreshTokenTimeout: any;
  

  constructor(private http: HttpClient, private router: Router) {
    this.loadToken();
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/auth/log-in`, { email, password })
      .pipe(
        tap(response => {
          if (response.token && response.refreshToken) {
            this.saveToken(response.token, response.refreshToken);
            this.startRefreshTokenTimer();
          }
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  private saveToken(token: string, refreshToken: string): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    this.tokenSubject.next(token);
  }

  private loadToken(): void {
    const token = localStorage.getItem('authToken');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.tokenSubject.next(token);
      this.startRefreshTokenTimer();
    }
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return throwError(() => 'No refresh token available');
    }

    return this.http.post<any>(`${this.API_URL}/auth/refresh-token`, refreshToken)
      .pipe(
        tap(response => {
          if (response.token && response.refreshToken) {
            this.saveToken(response.token, response.refreshToken);
            this.startRefreshTokenTimer();
          }
        }),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    return token ? this.jwtHelper.isTokenExpired(token) : true;
  }
  private startRefreshTokenTimer(): void {
    const token = this.tokenSubject.value;
    if (!token) return;

    const expires = this.jwtHelper.getTokenExpirationDate(token);
    if (!expires) return;

    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer(): void {
    clearTimeout(this.refreshTokenTimeout);
  }

  logout(): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    
    this.http.post(`${this.API_URL}/auth/log-out`, {}, { headers }).subscribe({
      next: () => this.handleLogout(),
      error: () => this.handleLogout()
    });
  }

  private handleLogout(): void {
    this.stopRefreshTokenTimer();
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    this.tokenSubject.next(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    console.log("token message: ", token);
    return token !== null && !this.jwtHelper.isTokenExpired(token);
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.role || null;
    } catch {
      return null;
    }
  }
  getCurrentUser():Observable<User | null>{
    const token = this.getToken();
    if (!token) return of(null);

    try {
      const decodedToken = this.jwtHelper.decodeToken(token) as User;
      return of(decodedToken);
    } catch {
      return of(null);
    }
  }
  getUserProfile(): Observable<User> {
    // Check if token is expired
    if (this.isTokenExpired()) {
      // Refresh the token first, then make the request
      return this.refreshToken().pipe(
        switchMap(() => {
          const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.getToken()}`
          });
          return this.http.get<User>('http://localhost:8082/auth/profile', { headers });
        })
      );
    } else {
      // Token is valid, proceed with request
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      });
      return this.http.get<User>('http://localhost:8082/auth/profile', { headers });
    }
  }
  
}
