import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Role} from 'src/app/model/user/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  returnUrl: string;
  userRoles: Role[];

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  // Redirect Component
  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/all-requests';
    this.authService.getSession().subscribe(session => {
      this.authService.setSessionInStorage(session.auth);
      this.authService.userRoles.next(session.userRoles);
      if (session.auth) {
        this.router.navigate([this.returnUrl]);
      } else {
        this.router.navigate(['/home']);
      }
    });
  }
}
