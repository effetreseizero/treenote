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
          nome: e.payload.doc.data()['nome'],
          localizzazione: e.payload.doc.data()['localizzazione'],
          note: e.payload.doc.data()['note'],
          deleted: e.payload.doc.data()['deleted'],
          createdTime: e.payload.doc.data()['createdTime'],
        };
      })
      .sort(
        (itemA, itemB) => {
          return itemB.createdTime - itemA.createdTime;
        }
      );

    });
  }


  async createSurvey() {
    this.router.navigate(['/menu/survey-edit']);
    /*
    const alert = await this.alertController.create({
      header: 'Inserisci segnalazione',
      inputs: [
        {name: 'nome',type: 'text',placeholder: 'Nome'}
      ],
      buttons: [
        {text: 'Cancel',role: 'cancel',cssClass: 'secondary',handler: () => {console.log('Confirm Cancel');}
        },
        {
          text: 'Ok',
          handler: (data) => {
            if (data.nome.length>0) {
              this.surveysService.create_survey_document(data).then(resp => {
                this.editSurvey(resp);
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

    await alert.present();*/
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

  editSurvey(record){
    //https://ionicacademy.com/pass-data-angular-router-ionic-4/
    let navigationExtras: NavigationExtras = {
      state: {
        id: record.id 
      }
    };
      this.router.navigate(['/menu/survey-edit'],navigationExtras);
  }

  activeSurveys(){
    return this.surveyList.filter(x => x.deleted == false);
}

}
