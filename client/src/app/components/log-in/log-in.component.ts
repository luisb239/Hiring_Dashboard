import {Component} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html'
})
export class LogInComponent {

  constructor(private authService: AuthService) {
    window.location.href = this.authService.azureAuthenticationUrl;
  }

}
