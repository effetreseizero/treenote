import { Component } from '@angular/core';
import { CoreFacade} from '../../services/storage/core.facade';
import { Observable } from 'rxjs';

import { Router, RouterEvent } from '@angular/router';

import { AuthenticationService } from "../../services/auth/authentication.service";


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private router: Router,
    public authService: AuthenticationService
  ) {}

  userLoggedIn = false;

  ngOnInit() {
    this.authService.isLoggedIn.then((resp)=>{
      debugger;
      this.userLoggedIn=resp;
    });
  }

  public logIn(): void{
    if(!this.authService.isLoggedIn){
      this.router.navigate(['/menu/login']);
    }else{
      this.router.navigate(['/menu/user-account']);
    }
  }

}


