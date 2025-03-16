import { HttpInterceptor,HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { AuthService } from "../services/auth.service";
import { Injectable } from "@angular/core";
import { catchError, switchMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
@Injectable()
export class Auth implements HttpInterceptor {
    constructor(private authService:AuthService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = this.authService.getToken();
    
        if (token) {
          const cloned = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
    
          return next.handle(cloned).pipe(
            catchError((error: HttpErrorResponse) => {
              if (error.status === 401) { // Si le token est expiré
                return this.authService.refreshToken().pipe(
                  switchMap(() => {
                    // Réessayer la requête après rafraîchissement du token
                    token = this.authService.getToken();
                    const clonedRetry = req.clone({
                      setHeaders: {
                        Authorization: `Bearer ${token}`
                      }
                    });
                    return next.handle(clonedRetry);
                  })
                );
              } else {
                return throwError(error);
              }
            })
          );
        }
    
        return next.handle(req);
      }

}
