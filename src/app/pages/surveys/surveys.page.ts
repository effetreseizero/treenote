//https://www.freakyjolly.com/ionic-firebase-crud-operations/#.X-2m2On0mEJ

import { Component, OnInit } from '@angular/core';

import { SurveysService} from '../../services/firestore/surveys.service';

import { Router, NavigationExtras } from "@angular/router";

import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-surveys',
  templateUrl: './surveys.page.html',
  styleUrls: ['./surveys.page.scss'],
})
export class SurveysPage implements OnInit {

  surveyList = [];
  sentSurveyList = [];
  publicSurveyList = [];

  constructor(
    private surveysService: SurveysService,
    private router: Router,
    private alertController: AlertController
    
  )
  {
   
  }

  ngOnInit()
  {
    
    this.surveysService.read_user_surveys_collection().subscribe(data => {
      this.surveyList = data.map(e => {
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

      this.sentSurveyList = this.surveyList.filter(x => (x.deleted == false && x.public==false));

      this.publicSurveyList = this.surveyList.filter(x => (x.deleted == false && x.public==true));

    });
  }


  async createSurvey() {
    this.router.navigate(['/menu/survey-edit']);
  }

  async deleteSurvey(recordId) {
    const alert = await this.alertController.create({
      header: 'Sei sicuro?',
      inputs: [
      ],
      buttons: [
        {text: 'Annulla',role: 'cancel',cssClass: 'secondary',handler: () => {console.log('Annulla');}
        },
        {
          text: 'Ok',
          handler: () => {
            this.surveysService.delete_surveys_document(recordId);
            console.log('Confirm Ok');
          }
        }
      ]
    });
    await alert.present();
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

}
