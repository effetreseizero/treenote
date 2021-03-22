import { Component, OnInit } from '@angular/core';

import { SurveysService} from '../../services/firestore/surveys.service';


import { Router, NavigationExtras } from "@angular/router";

import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-surveys-manager',
  templateUrl: './surveys-manager.page.html',
  styleUrls: ['./surveys-manager.page.scss'],
})
export class SurveysManagerPage implements OnInit {

  surveysList = [];

  constructor(
    private surveysService: SurveysService,
    private router: Router,
    private alertController: AlertController
  ) {
    
   }

  ngOnInit() {
    this.surveysService.read_all_surveys_collection().subscribe(data => {
      this.surveysList = data.map(e => {
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
        return survey;
      })
      .sort(
        (itemA, itemB) => {
          return itemB["created_time"] - itemA["created_time"];
        }
      );
    });
  }

  editSurvey(recordId){
    //https://ionicacademy.com/pass-data-angular-router-ionic-4/
    let navigationExtras: NavigationExtras = {
      state: {
        id: recordId 
      }
    };
      this.router.navigate(['/menu/survey-edit'],navigationExtras);
  }

  publicChange(e,item){
    let data = {
      public: item.public
    }

    this.surveysService.update_surveys_document(item.id, data);
  }



}
