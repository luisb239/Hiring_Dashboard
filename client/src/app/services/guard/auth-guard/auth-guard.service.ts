import {Injectable} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AlertService} from '../../alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private alert: AlertService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.currentUserId) {
      this.router.navigate(['/'], {queryParams: {returnUrl: state.url}});
      return false;
    }
    if (!this.checkRoles(route.data.roles)) {
      this.alert.warn('You do not have necessary permissions to access this page');
      this.router.navigate([this.authService.genericRoute]);
      return false;
    }
    return true;
  }

  checkRoles(roles: any[]) {
    if (!roles || roles.length === 0) {
      return true;
    }
    return this.authService.currentUserRoles.find(ur => roles.includes(ur.role));
  }
}
