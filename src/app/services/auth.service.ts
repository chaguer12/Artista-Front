import { Injectable } from '@angular/core';
import { BehaviorSubject,Observable, switchMap } from 'rxjs';
import { catchError } from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private jwtHelper = new JwtHelperService();
  private authUrl = "http://localhost:8082/auth/log-in";
  private refreshUrl = "http://localhost:8082/auth/refresh-token";
  private logoutUrl = "http://localhost:8082/auth/log-out";
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient,private router:Router) {
    this.loadToken();
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post(this.authUrl, { email, password })
      .pipe(
        switchMap((response:any) =>{
          this.saveToken(response.token);
          return this.tokenSubject.asObservable();
        }),
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
    this.logoutBackend().subscribe({
      next: () => {
        // On supprime le token et on redirige après le logout backend
        localStorage.removeItem('authToken');
        this.tokenSubject.next(null);
        this.router.navigate(['/login']);
      },
      error: () => {
        // Si le backend échoue, on effectue le nettoyage côté frontend quand même
        localStorage.removeItem('authToken');
        this.tokenSubject.next(null);
        this.router.navigate(['/login']);
      }
    });
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
  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken'); // Récupère le refresh token
    if (refreshToken) {
      return this.http
        .post<any>(this.refreshUrl, { refreshToken })
        .pipe(
          switchMap((response: any) => {
            // Sauvegarde le nouveau token
            this.saveToken(response.token);
            return this.tokenSubject.asObservable();
          }),
          catchError(error => {
            this.logout(); // Déconnecte l'utilisateur si le refresh échoue
            throw error;
          })
        );
    } else {
      this.logout(); // Déconnecte si aucun refresh token n'est disponible
      return new Observable();
    }
  }

  logoutBackend(): Observable<any>{
    return this.http.post<any>(this.logoutUrl, {}, { 
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`)
    });
  }
}
