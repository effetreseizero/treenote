import { Component, ViewChild } from '@angular/core';
import { CoreFacade} from '../../services/storage/core.facade';
import { Observable } from 'rxjs';

import { Router, RouterEvent } from '@angular/router';

import { AuthenticationService } from "../../services/auth/authentication.service";

import Map from 'ol/Map';

//https://medium.com/runic-software/a-simple-guide-to-openlayers-in-angular-b10f6feb3df1
import {OlMapComponent} from '../../components/ol-map/ol-map.component';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  //https://www.pluralsight.com/guides/using-template-reference-variables-to-interact-with-nested-components
  @ViewChild('app_ol_map') olMapComponent:OlMapComponent;
  map: Map;

  constructor(
    private router: Router,
    public authService: AuthenticationService
  ) {}

  userLoggedIn = false;

  ngOnInit() {
    this.authService.isLoggedIn.then((resp)=>{
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

  public onMapReady(event) {
    console.log("Map Ready");
    this.map = event;
    
  }

}


