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
      });
    }
  }

}
