import { Component, OnInit, ViewChild } from '@angular/core';

import { SurveysService} from '../../services/firestore/surveys.service';
import { PublicSurveysStore } from '../../services/public-surveys-store/public-surveys-store.service'


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
  archiveSurveyList = [];

  publicInfiniteScrollSlice: number = 100;

   //https://gist.github.com/mdorchain/90ee6a0b391b6c51b2e27c2b000f9bdd
   @ViewChild('surveySlider', { static: true }) surveySlider: IonSlides;
   slideOptsSurveySlider = {
     initialSlide: 0,  
 
     //with autoHeigth Openlayers Map is not correctly resized, even if map.autoSize() is called onSlideChanged
     autoHeight: true
   };
   segmentSelected = 0;

  constructor(
    private surveysService: SurveysService,
    private router: Router,
    private alertController: AlertController,
    private publicSurveysStore: PublicSurveysStore
  ) {
    
  }

  ngOnInit() {
    this.surveysService.read_sent_surveys_collection().subscribe(data => {
      this.sentSurveyList = data.map(e => {
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
      .filter(x=>(!x["deleted"]))
      .sort(
        (itemA, itemB) => {
          return itemB["created_time"] - itemA["created_time"];
        }
      );
    });

    this.surveysService.read_review_surveys_collection().subscribe(data => {
      this.reviewSurveyList = data.map(e => {
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
      .filter(x=>(!x["deleted"]))
      .sort(
        (itemA, itemB) => {
          return itemB["created_time"] - itemA["created_time"];
        }
      );
    });

    this.surveysService.read_archive_surveys_collection().subscribe(data => {
      this.archiveSurveyList = data.map(e => {
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
      .filter(x=>(!x["deleted"]))
      .sort(
        (itemA, itemB) => {
          return itemB["created_time"] - itemA["created_time"];
        }
      );
    });


    
    this.publicSurveysStore.subscribePublicSurveys().subscribe((data)=>{
      this.publicSurveyList = data.features;
    });
          
  }

  doInfinite(infiniteScroll) {
    this.publicInfiniteScrollSlice += 100;
    infiniteScroll.target.complete();
    
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

  async promoteToReview(recordId){

    const alert = await this.alertController.create({
      header: 'Sposta in revisione?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Ok',
          handler: () => {
            let data = {
              status: "review"
            }
        
            this.surveysService.update_surveys_document(recordId, data,[]).then(()=>{
              //this.segmentSelected = 1;
            });
          }
        }
      ]
    });

    await alert.present();

    
  }

  async promoteToSent(recordId){

    const alert = await this.alertController.create({
      header: 'Sposta in inviate?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Ok',
          handler: () => {
            let data = {
              status: "sent"
            }
        
            this.surveysService.update_surveys_document(recordId, data,[]).then(()=>{
              //this.segmentSelected = 1;
            });
          }
        }
      ]
    });

    await alert.present();

    
  }

  async promoteToReviewFromPublic(recordId){

    const alert = await this.alertController.create({
      header: 'Sposta in revisione?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Ok',
          handler: () => {
            this.publicSurveysStore.removePublicSurvey(recordId,"review").then(()=>{
              //this.segmentSelected = 1;
            });
          }
        }
      ]
    });

    await alert.present();

    
  }

  async promoteToPublic(recordId){

    const alert = await this.alertController.create({
      header: 'Rendi pubblico?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Ok',
          handler: () => {
            this.publicSurveysStore.addPublicSurvey(recordId).then(()=>{
              //this.segmentSelected = 2;
            });
          }
        }
      ]
    });

    await alert.present();

  }

  async promoteToArchive(recordId){

    const alert = await this.alertController.create({
      header: 'Sposta in archivio?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Ok',
          handler: () => {
            let data = {
              status: "archive"
            }
            
            this.surveysService.update_surveys_document(recordId, data,[]).then(()=>{
              //this.segmentSelected = 3;
            });;
          }
        }
      ]
    });

    await alert.present();

    
  }

  async promoteToArchiveFromPublic(recordId){

    const alert = await this.alertController.create({
      header: 'Sposta in archivio?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Ok',
          handler: () => {
            this.publicSurveysStore.removePublicSurvey(recordId,"archive").then(()=>{
              //this.segmentSelected = 3;
            });;
          }
        }
      ]
    });

    await alert.present();

    
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
