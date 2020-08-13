import {Component} from '@angular/core';
import {AuthService} from './services/auth/auth.service';
import {Role} from './model/user/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  userRoles: Role[];

  constructor(public authService: AuthService) {
    this.authService.userRoles.subscribe(roles => this.userRoles = roles);
  }
}
