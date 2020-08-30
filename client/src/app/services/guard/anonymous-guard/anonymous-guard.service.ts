import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnonymousGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // If Anonymous, can access the page
    if (!this.authService.currentUserId) {
      return true;
    }
    // Else force redirect to Dashboard
    this.router.navigate(['/']);
    return false;
  }

}
