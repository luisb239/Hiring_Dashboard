import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  authUrl = `http://localhost:8080/hd/auth`;
  azureAuthenticationUrl = `${this.authUrl}/azure`;

  constructor(private router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
    window.location.href = this.azureAuthenticationUrl;
  }

}
