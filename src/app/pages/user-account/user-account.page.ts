import { Component, OnInit } from '@angular/core';

import { Router } from "@angular/router";

import { AuthenticationService } from "../../services/user/authentication.service";


@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.page.html',
  styleUrls: ['./user-account.page.scss'],
})
export class UserAccountPage implements OnInit {

  constructor(
    public authService: AuthenticationService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  public logout(){
    this.authService.SignOut();
  }

}
