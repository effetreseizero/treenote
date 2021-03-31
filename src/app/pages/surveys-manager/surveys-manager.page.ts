import { Component, OnInit, ViewChild } from '@angular/core';

import { SurveysService} from '../../services/firestore/surveys.service';


import { Router, NavigationExtras } from "@angular/router";

import { AlertController, IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-surveys-manager',
  templateUrl: './surveys-manager.page.html',
  styleUrls: ['./surveys-manager.page.scss'],
})
export class SurveysManagerPage implements OnInit {

  surveysList = [];
  sentSurveyList = [];
  reviewSurveyList = [];
  publicSurveyList = [];

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

      this.sentSurveyList = this.surveysList.filter(x => (x.deleted == false && x.review==false && x.public==false));
      this.reviewSurveyList = this.surveysList.filter(x => (x.deleted == false && x.review==true && x.public==false));
      this.publicSurveyList = this.surveysList.filter(x => (x.deleted == false && x.review==false && x.public==true));

    });
  }

  //https://gist.github.com/mdorchain/90ee6a0b391b6c51b2e27c2b000f9bdd
  @ViewChild('surveySlider', { static: true }) surveySlider: IonSlides;
  slideOptsSurveySlider = {
    initialSlide: 0,  

    //with autoHeigth Openlayers Map is not correctly resized, even if map.autoSize() is called onSlideChanged
    //autoHeight: true
  };
  segmentSelected = 0;

  editSurvey(recordId){
    //https://ionicacademy.com/pass-data-angular-router-ionic-4/
    let navigationExtras: NavigationExtras = {
      state: {
        id: recordId 
      }
    };
      this.router.navigate(['/menu/survey-edit'],navigationExtras);
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

  promoteToReview(recordId){
    let data = {
      review: true
    }

    this.surveysService.update_surveys_document(recordId, data);
  }

  promoteToPublic(recordId){
    let data = {
      review: false,
      public: true
    }

    this.surveysService.update_surveys_document(recordId, data);
  }

  /**
   * Slider managment
   * @param $event 
   */
  //https://gist.github.com/mdorchain/90ee6a0b391b6c51b2e27c2b000f9bdd
  async segmentChanged($event){
    this.surveySlider.slideTo(this.segmentSelected);
  }
  async slideChanged($event) {
    this.segmentSelected = await this.surveySlider.getActiveIndex();
  }



}
