import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userRole = authService.getUserRole(); 
  console.log("Extracted Role:", userRole);
  const requiredRoles = route.data['role']; 

  if (userRole && requiredRoles.includes(userRole)) {
    return true; 
  }

  router.navigate(['/unauthorized']); 
  return false;
};
