import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');

    if (!user || !role) {
      this.router.navigate(['/login']);
      return false;
    }

    const allowedRoles = route.data['roles'] as string[];

    if (!allowedRoles || allowedRoles.includes(role)) {
      return true;
    }

    // Not allowed: redirect to login or a forbidden page
    this.router.navigate(['/login']);
    return false;
  }
}
