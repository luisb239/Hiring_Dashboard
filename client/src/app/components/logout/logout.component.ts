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
    this.authService.logout().subscribe(() => {
      this.authService.clearSessionFromStorage();
      this.authService.userRoles = null;
      this.router.navigate(['/home']);
    });
  }

}
