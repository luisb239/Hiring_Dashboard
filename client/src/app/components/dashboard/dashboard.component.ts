import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { Role } from 'src/app/model/user/user';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userRoles: Role[];
  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService) {
  }

  // Redirect Component
  ngOnInit(): void {
    if (this.authService.getSessionFromStorage()) {
      this.router.navigate(['/all-requests']);
    } else {
      this.authService.getSession().subscribe(session => {
        this.authService.setSessionInStorage(session.auth);
        if (session.auth) {
          this.router.navigate(['/all-requests']);
        } else {
          this.router.navigate(['/home']);
        }
        this.authService.userRoles = session.userRoles;
      });
    }
  }
}
