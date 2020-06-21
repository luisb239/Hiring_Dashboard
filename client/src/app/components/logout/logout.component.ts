import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
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
