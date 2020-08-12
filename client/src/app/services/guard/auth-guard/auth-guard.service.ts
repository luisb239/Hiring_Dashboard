import {Injectable} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AlertService} from '../../alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private alertService: AlertService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.getSessionFromStorage()) {
      // Store the attempted URL for redirecting -> TODO -> We are not redirecting yet..
      this.authService.redirectUrl = state.url;
      // Alert the user
      this.alertService.warn('You need to be signed in order to perform that action');
    } else if (this.checkRoles(route.data.roles)) {
      return true;
    }
    // Navigate to the home page
    this.router.navigate(['/home']);
    return false;
  }

  checkRoles(roles: any[]) {
    return !roles || this.authService.userRoles.find(ur => roles.includes(ur.role));
  }
}
