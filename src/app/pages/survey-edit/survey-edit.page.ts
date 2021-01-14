//https://www.freakyjolly.com/ionic-firebase-crud-operations/#.X-2m2On0mEJ

//https://www.joshmorony.com/advanced-forms-validation-in-ionic-2/



import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';

import { Router, ActivatedRoute, RouteReuseStrategy } from '@angular/router';
import { IonSlides, NavController,Platform, ToastController  } from '@ionic/angular';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { SurveysService} from '../../services/firestore/surveys.service';
import { Survey} from '../../services/firestore/survey';

import { AlertController } from '@ionic/angular';

//https://forum.ionicframework.com/t/generating-a-openlayers-map-as-a-component/161373/4

import Map from 'ol/Map';

//https://medium.com/runic-software/a-simple-guide-to-openlayers-in-angular-b10f6feb3df1
import {OlMapComponent} from '../../components/ol-map/ol-map.component';

//https://dev.to/saviosantos0808/real-time-localization-using-ionic-framework-and-google-spreadsheets-35pe
import { Geolocation } from '@ionic-native/geolocation/ngx';

//https://firebase.google.com/docs/firestore/solutions/geoqueries
import{ geohashForLocation } from 'geofire-common';
import { coordinateRelationship } from 'ol/extent';




@Component({
  selector: 'app-survey-edit',
  templateUrl: './survey-edit.page.html',
  styleUrls: ['./survey-edit.page.scss'],
})
export class SurveyEditPage implements OnInit {

  private surveyId = null;
  private survey=null;
  private treeList = null;

  private random_coords = true;

  public surveyForm: FormGroup;
  public submitAttempt: boolean = false;

  //https://gist.github.com/mdorchain/90ee6a0b391b6c51b2e27c2b000f9bdd
  @ViewChild('surveySlider', { static: true }) surveySlider: IonSlides;
  slideOptsSurveySlider = {
    initialSlide: 0,  
    autoHeight: true
  };
  segmentSelected = 0;

  coords: any = [];

  //https://www.pluralsight.com/guides/using-template-reference-variables-to-interact-with-nested-components
  @ViewChild('app_ol_map') olMapComponent:OlMapComponent;
  map: Map;

  constructor(
    private activatedRoute:ActivatedRoute,
    private navController: NavController,
    private router:Router,
    public formBuilder: FormBuilder,
    private surveysService:SurveysService,
    private alertController:AlertController,
    private elementRef:ElementRef,
    private platform:Platform,
    private toastController:ToastController,
    private geolocation: Geolocation
  ) {

    this.surveyForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      location: ['', ],
      notes: ['', ]
    });

    ////https://dev.to/saviosantos0808/real-time-localization-using-ionic-framework-and-google-spreadsheets-35pe
    this.geolocation.watchPosition().subscribe(async(response: any)=>{
      this.coords = response.coords;
    });


  }

  ngOnInit() {
    
    //https://ionicacademy.com/pass-data-angular-router-ionic-4/
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {

        this.surveyId = this.router.getCurrentNavigation().extras.state.id;

        //read survey data

        this.surveysService.read_surveys_document(this.surveyId).subscribe((data)=>{
          this.survey=data.payload.data();
          //https://angular.io/guide/deprecations#ngmodel-with-reactive-forms
          //https://ultimatecourses.com/blog/angular-2-form-controls-patch-value-set-value
          this.surveyForm.patchValue(this.survey);
        });

        //read survey trees data
        this.surveysService.read_trees_subcollection(this.surveyId).subscribe(data => {

          this.treeList = data.map(e => {
            return {
              id: e.payload.doc.id,
              isEdit: false,
              d1: e.payload.doc.data()['d1'],
              d2: e.payload.doc.data()['d2'],
              number: e.payload.doc.data()['number'],
              specie: e.payload.doc.data()['specie'],
              lat: e.payload.doc.data()['lat'],
              lng: e.payload.doc.data()['lng'],
              geohash: e.payload.doc.data()['geohash'],
              createdTime: e.payload.doc.data()['createdTime'],
            };
          })
          //https://www.w3schools.com/js/js_array_sort.asp
          .sort(
            (itemA, itemB) => {
              return itemB.createdTime - itemA.createdTime;
            }
          );
          this.olMapComponent.updateTreesLayer(this.treeList);
        });

      }
    });
    
  }

  saveSurvey() {
    this.submitAttempt = true;

    if(!this.surveyForm.valid){
        this.surveySlider.slideTo(0);
    } 
    else{
      this.surveysService.update_surveys_document(this.surveyId, this.surveyForm.value);
      this.navController.back();
    }
  }

  async addTree()
  {
    const alert = await this.alertController.create({
      header: 'Crea',
      inputs: [
        {name: 'specie',type: 'text',placeholder: 'Specie'},
        {name: 'd1',type: 'number',placeholder: 'D1'},
        {name: 'd2',type: 'number',placeholder: 'D2'}
      ],
      buttons: [
        {text: 'Cancel',role: 'cancel',cssClass: 'secondary',handler: () => {console.log('Confirm Cancel');}
        },
        {
          text: 'Ok',
          handler: (data) => {
            if (data.specie.length>0 && data.d1>0 && data.d2>0) {
              data.lat = this.coords.latitude;
              data.lng = this.coords.longitude;
              if (this.random_coords){
                function getRandomInRange(from, to, fixed) {
                  return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
                }
                var lat_dev = getRandomInRange(-0.001, 0.001, 6);
                var lng_dev =  getRandomInRange(-0.001, 0.001, 6);
                data.lat += lat_dev;
                data.lng += lng_dev;
              }

              //https://firebase.google.com/docs/firestore/solutions/geoqueries
              data.geohash = geohashForLocation([data.lat, data.lng]);
              
              this.surveysService.create_tree_document(this.surveyId,data).then(resp => {
              })
              .catch(error => {
                console.log(error);
              });
              return true;
            //https://stackoverflow.com/questions/45969821/alert-controller-input-box-validation
            } else{
              this.showErrorToast('Dati errati');
              return false;
            }
            
          }
        }
      ]
    });

    await alert.present();
  }

  async showErrorToast(data: any) {
    let toast = await this.toastController.create({
      message: data,
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }


  deleteTree(treeID) {
    this.surveysService.delete_tree_document(this.surveyId,treeID);
  }

 
  editTree(record) {
    record.isEdit = true;
    record.editSpecie = record.specie;
    record.editD1= record.d1;
    record.editD2 = record.d2;
  }

  updateTree(item) {
    let record = {};
    record['specie'] = item.editSpecie;
    record['d1'] = item.editD1;
    record['d2'] = item.editD2;
    this.surveysService.update_tree_document(this.surveyId,item.id, record);
    item.isEdit = false;
  }

  //https://gist.github.com/mdorchain/90ee6a0b391b6c51b2e27c2b000f9bdd
  async segmentChanged($event){
    this.surveySlider.slideTo(this.segmentSelected);
  }
  async slideChanged($event) {
    this.segmentSelected = await this.surveySlider.getActiveIndex();
  }


  public onMapReady(event) {
    console.log("Map Ready");
    this.map = event;
    this.olMapComponent.updateTreesLayer(this.treeList);
    this.olMapComponent.zoomTreesLayer();
  }

}
