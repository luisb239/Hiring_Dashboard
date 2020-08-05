import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    // login -> redirect to office 365 auth
    // TODO -> Change into an <a href...> with ngIf notAuthenticated
    window.location.href = this.authService.azureAuthenticationUrl;
  }

}
