import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {UserDao} from '../../model/dao/user-dao';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: UserDao;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.authService.getUserInfo();
  }

}
