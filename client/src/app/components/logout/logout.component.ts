import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html'
})
export class LogoutComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.authService.logout().subscribe(data => {
      this.authService.isAuthenticated = data.auth;
      this.authService.userId = data.userId;
      this.router.navigate(['/home']);
    });
  }

}
