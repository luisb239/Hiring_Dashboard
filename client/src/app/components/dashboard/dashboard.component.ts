import {Component} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Role} from 'src/app/model/user/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  returnUrl: string;
  userRoles: Role[];

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/all-requests';
    this.authService.getSession().subscribe(session => {
      if (!session.auth) {
        // User not authenticated
        this.authService.userId.next(null);
        this.authService.userRoles.next([]);
        this.router.navigate(['/home']);
      } else {
        // User authenticated
        this.authService.userId.next(session.userId);
        this.authService.userRoles.next(session.userRoles);
        this.router.navigate([this.returnUrl]);
      }
    });
  }

}
