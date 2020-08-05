import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.authService.getSession().subscribe(session => {
      this.authService.isAuthenticated = session.auth;
      this.authService.userId = session.userId;
      if (session.auth) {
        this.router.navigate(['/all-requests']);
      } else {
        this.router.navigate(['/home']);
      }
    });
  }

}
