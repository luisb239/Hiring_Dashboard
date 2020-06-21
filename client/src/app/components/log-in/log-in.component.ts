import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  authUrl = `/hd/auth`;
  azureAuthenticationUrl = `${this.authUrl}/azure`;

  constructor() {
  }

  ngOnInit(): void {
    window.location.href = this.azureAuthenticationUrl;
  }

}
