import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { Router, RouterEvent } from '@angular/router';

import { AuthenticationService } from "../../services/auth/authentication.service";
import {CoreFacade} from "../../services/storage/core.facade"

import { SurveysService} from '../../services/firestore/surveys.service';

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
  publicSurveysList=[];

  constructor(
    private router: Router,
    public authService: AuthenticationService,
    private coreFacade: CoreFacade,
    private surveyService: SurveysService
  ) {}

  userLoggedIn = false;

  ngOnInit() {
    this.coreFacade.getUser().subscribe((user)=>{
      this.user=user;
    });

    this.surveyService.read_public_surveys_collection().subscribe((data)=>{
      
      this.publicSurveysList=data.map(e => {
        let survey = {};
        //add id of syrvey
        survey["id"]=e.payload.doc.id;
        //add all other properties
        for (let key of Object.keys(e.payload.doc.data())){
          survey[key] = e.payload.doc.data()[key];
        }

        //https://stackoverflow.com/questions/2388115/get-locale-short-date-format-using-javascript/31663241
        var date = new Date(survey["data_ora_osservazione"]);
        var options = {
            year: "numeric",
            month: "2-digit",
            day: "numeric",
            hour: "numeric",
            minute:"numeric"
        };
        
        survey["short_date"] =  date.toLocaleDateString("it", options) //en is language option, you may specify..
        this.olMapComponent.setSurveyPosition(survey["longitudine"],survey["latitudine"]);
        return survey;
      });
      //https://angular.io/guide/deprecations#ngmodel-with-reactive-forms
      //https://ultimatecourses.com/blog/angular-2-form-controls-patch-value-set-value

      
      //this.olMapComponent.centerOn(this.survey.longitudine,this.survey.latitudine);
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


