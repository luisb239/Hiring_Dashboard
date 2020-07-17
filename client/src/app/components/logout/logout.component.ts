import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html'
})
export class LogoutComponent implements OnInit {

  authUrl = `/hd/auth`;
  logoutUrl = `${this.authUrl}/logout`;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.setUserInfo(null);
    window.location.href = this.logoutUrl;
  }

}
