import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AdminGuard implements CanActivate {

  redirectUrl;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  // Function to check if user is authorized to view route
  canActivate(
    router: ActivatedRouteSnapshot
  ) {
    // Check if user is logge din
    if (this.authService.isAdmin()) {
      return true; // Return true: User is allowed to view route
    } else {
      this.router.navigate(['/']); // Return error and route to login page
      return false; // Return false: user not authorized to view page
    }
  }
}