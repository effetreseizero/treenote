import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { Router, RouterEvent } from '@angular/router';

import { AuthenticationService } from "../../services/auth/authentication.service";
import {CoreFacade} from "../../services/storage/core.facade"

import Map from 'ol/Map';

//https://medium.com/runic-software/a-simple-guide-to-openlayers-in-angular-b10f6feb3df1
import {OlMapComponent} from '../../components/ol-map/ol-map.component';
import { User } from 'src/app/services/storage/user';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  //https://www.pluralsight.com/guides/using-template-reference-variables-to-interact-with-nested-components
  @ViewChild('app_ol_map') olMapComponent:OlMapComponent;
  map: Map;
  user: User;

  constructor(
    private router: Router,
    public authService: AuthenticationService,
    private coreFacade: CoreFacade
  ) {}

  userLoggedIn = false;

  ngOnInit() {
    this.coreFacade.getUser().subscribe((user)=>{
      this.user=user;
    });
  }

  public logIn(): void{
    this.router.navigate(['/menu/login']);
  }

  public userAccout(): void{
    this.router.navigate(['/menu/user-account']);
  }

  public onMapReady(event) {
    console.log("Map Ready");
    this.map = event;
    
  }

}


