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

  constructor(
    private surveysService: SurveysService,
    private router: Router,
    private alertController: AlertController
    
  )
  {
   
  }

  ngOnInit()
  {
    
    this.surveysService.read_surveys_collection().subscribe(data => {
      
      this.surveyList = data.map(e => {
        return {
          id: e.payload.doc.id,
          isEdit: false,
          name: e.payload.doc.data()['name'],
          location: e.payload.doc.data()['location'],
          notes: e.payload.doc.data()['notes'],

        };
      });
      console.log("surveyList: ");
      console.log(this.surveyList);

    });
  }


  async createSurvey() {
    const alert = await this.alertController.create({
      header: 'Crea',
      inputs: [
        {name: 'name',type: 'text',placeholder: 'Nome'}
      ],
      buttons: [
        {text: 'Cancel',role: 'cancel',cssClass: 'secondary',handler: () => {console.log('Confirm Cancel');}
        },
        {
          text: 'Ok',
          handler: (data) => {
            if (data.name.length>0) {
              this.surveysService.create_survey_document(data).then(resp => {
                this.updateSurvey(resp);
              })
              .catch(error => {
                console.log(error);
              });
            }
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteSurvey(recordID) {
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
            this.surveysService.delete_surveys_document(recordID);
            console.log('Confirm Ok');
          }
        }
      ]
    });
    await alert.present();
  }

  updateSurvey(record){
    //https://ionicacademy.com/pass-data-angular-router-ionic-4/
    let navigationExtras: NavigationExtras = {
      state: {
        id: record.id 
      }
    };
      this.router.navigate(['/menu/survey-edit'],navigationExtras);
  }

}
