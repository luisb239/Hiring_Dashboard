import {Injectable} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AlertService} from '../../alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.getSessionFromStorage() && this.authService.currentUserRoles &&
      this.authService.currentUserRoles.length > 0 && this.checkRoles(route.data.roles)) {
      return true;
    }
    this.router.navigate(['/'], {queryParams: {returnUrl: state.url}});
    return false;
  }

  checkRoles(roles: any[]) {
    if (!roles || roles.length === 0) {
      return true;
    }
    return this.authService.currentUserRoles.find(ur => roles.includes(ur.role));
  }
}
