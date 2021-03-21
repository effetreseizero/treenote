//https://www.freakyjolly.com/ionic-firebase-crud-operations/#.X-2m2On0mEJ

//https://www.joshmorony.com/advanced-forms-validation-in-ionic-2/



import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';

import { Router, ActivatedRoute, RouteReuseStrategy } from '@angular/router';
import { IonContent,IonSlides, NavController,Platform, ToastController  } from '@ionic/angular';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { SurveysService} from '../../services/firestore/surveys.service';
import { Survey} from '../../services/firestore/survey';

import { AlertController } from '@ionic/angular';

//https://ionicframework.com/docs/angular/your-first-app/2-taking-photos
import { PhotoService, Photo } from '../../services/photo/photo.service';


//https://medium.com/runic-software/a-simple-guide-to-openlayers-in-angular-b10f6feb3df1
import {OlMapComponent} from '../../components/ol-map/ol-map.component';

//https://forum.ionicframework.com/t/generating-a-openlayers-map-as-a-component/161373/4

import {Map,View, Feature} from "ol";
import {Vector as VectorSource ,OSM,Cluster} from "ol/source";
import {Style,Icon,Fill,Circle,Stroke, Text as TextStyle, RegularShape} from 'ol/style';
import {Tile,WebGLPoints,Layer, Vector as VectorLayer} from "ol/layer";
import {Point} from "ol/geom";
import { fromLonLat } from "ol/proj";

//https://dev.to/saviosantos0808/real-time-localization-using-ionic-framework-and-google-spreadsheets-35pe
import { Geolocation } from '@ionic-native/geolocation/ngx';

//https://firebase.google.com/docs/firestore/solutions/geoqueries
import{ geohashForLocation } from 'geofire-common';
import{ coordinateRelationship } from 'ol/extent';




@Component({
  selector: 'app-survey-edit',
  templateUrl: './survey-edit.page.html',
  styleUrls: ['./survey-edit.page.scss'],
})
export class SurveyEditPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  private surveyId = "0";
  private survey=null;
  private editable = true;

  public surveyForm: FormGroup;
  public submitAttempt: boolean = false;

  //https://gist.github.com/mdorchain/90ee6a0b391b6c51b2e27c2b000f9bdd
  @ViewChild('surveySlider', { static: true }) surveySlider: IonSlides;
  slideOptsSurveySlider = {
    initialSlide: 0,  

    //with autoHeigth Openlayers Map is not correctly resized, even if map.autoSize() is called onSlideChanged
    //autoHeight: true
  };
  segmentSelected = 0;

  //https://www.pluralsight.com/guides/using-template-reference-variables-to-interact-with-nested-components
  @ViewChild('app_ol_map') olMapComponent:OlMapComponent;
  map: Map;

  surveyPositionVectorSource= new VectorSource({
    features: []
  });

  gpsPositionVectorSource= new VectorSource({
    features: []
  });

  photos: Photo[] = [];

  geoLocationWatch:any;
  geoLocationWatchStarted = false;
  coords: any = [];
  lastcoords:any = {latitude:0,longitude:0,accuracy:0};

 

  constructor(
    private activatedRoute:ActivatedRoute,
    private navController: NavController,
    private router:Router,
    public formBuilder: FormBuilder,
    private surveysService:SurveysService,
    private alertController:AlertController,
    private toastController:ToastController,
    private geolocation: Geolocation,
    public photoService: PhotoService
  ) {


    this.surveyForm = this.formBuilder.group({
      data_ora_osservazione: ['', [Validators.required]],
      localita: ['', [Validators.required]],
      tipologia: ['', [Validators.required]],
      identificazione: ['', [Validators.required]],      
      nome_comune: ['',[]],
      loc_problema: ['', [Validators.required]],
      commenti: ['', []],
      specie: ['', [Validators.required]],
      nome_scientifico: ['',[]],
      sintomi: ['', [Validators.required]],
      diffusione_perc: ['', [Validators.required]],
      alberi_morti: ['', [Validators.required]],
    });


  }

  ngOnInit() {

    this.geolocationInit();
    
    //https://ionicacademy.com/pass-data-angular-router-ionic-4/
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {

        this.editable = false;

        this.surveyId = this.router.getCurrentNavigation().extras.state.id;

        //read survey data

        this.surveysService.read_surveys_document(this.surveyId).subscribe((data)=>{

          this.survey=data.payload.data();
          //https://angular.io/guide/deprecations#ngmodel-with-reactive-forms
          //https://ultimatecourses.com/blog/angular-2-form-controls-patch-value-set-value
          this.surveyForm.patchValue(this.survey);

          this.surveyForm.disable();

          this.photos = [];
          for (let i=0;i<3;i++){
            if(this.survey["photo_"+i+"_imageurl"]){
              this.photos.push({
                filetype: "jpeg",
                webviewPath: this.survey["photo_"+i+"_imageurl"]
              })
            }
          }


          this.surveyPositionVectorSource.clear();
          let surveyPositionFeature = new Feature();
          
          surveyPositionFeature.setGeometry(this.survey.longitudine&&this.survey.latitudine ? new Point(fromLonLat([this.survey.longitudine, this.survey.latitudine])) : null);
          this.surveyPositionVectorSource.addFeature(surveyPositionFeature)

          this.olMapComponent.centerOn(this.survey.longitudine,this.survey.latitudine);
        });
      }else{
        this.surveyId = "0";

        this.editable = true;

        this.surveyForm.patchValue({
          data_ora_osservazione: (new Date).toJSON(),
          //DUMMY DATA
          localita: "Trento",
          tipologia: "010_gruppo",
          identificazione: "010_conifera",      
          nome_comune: "",
          loc_problema: "010_chioma",
          commenti: "",
          specie: "010_pino",
          nome_scientifico: "",
          sintomi: "010_avvizzimento_fogliare",
          diffusione_perc: "010_minore_20",
          alberi_morti: "010_si", 
        });
      }
    });

    
  }

  /**
   * Cancel survey button
   */
  async cancelEdit() {
    if(this.editable){
      this.submitAttempt = true;

      const alert = await this.alertController.create({
        header: 'Sei sicuro di voler annullare le modifiche?',
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
              this.navController.back();
            }
          }
        ]
      });

      await alert.present();
    }else{
      this.navController.back();
    }
    
  }

  /**
   * Save survey button
   */
  async saveSurvey() {
    this.submitAttempt = true;

    if(!this.surveyForm.valid){
        this.surveySlider.slideTo(0);
    } 
    else{
      const alert = await this.alertController.create({
        header: 'Confermi modifiche?',
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
              if(this.surveyId=="0"){
                this.surveyForm.value["latitudine"]=(this.lastcoords.latitude);
                this.surveyForm.value["longitudine"]=this.lastcoords.longitude;
                this.surveyForm.value["quota"]=this.lastcoords.altitude;
                this.surveyForm.value["accuratezza"]=this.lastcoords.accuracy;
                this.surveysService.create_surveys_document(this.surveyForm.value,this.photos).then(()=>{
                  this.navController.back();
                });
                
              }else{
                this.surveysService.update_surveys_document(this.surveyId, this.surveyForm.value).then(()=>{
                  this.navController.back();
                });
              }
            }
          }
        ]
      });
  
      await alert.present();
    }
  }

  /**
   * Form error toast
   * @param data error message
   */

  async showErrorToast(data: any) {
    let toast = await this.toastController.create({
      message: data,
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }

  /**
   * Slider managment
   * @param $event 
   */
  //https://gist.github.com/mdorchain/90ee6a0b391b6c51b2e27c2b000f9bdd
  async segmentChanged($event){
    
    this.surveySlider.slideTo(this.segmentSelected);
    this.surveySlider.getSwiper().then((swiper)=>{
      swiper.updateAutoHeight(0);
    });

    
  }
  async slideChanged($event) {
    this.segmentSelected = await this.surveySlider.getActiveIndex();
  }


  async addPhotoToGallery() {
    if(this.photos.length<3){
      const capturedPhoto = await this.photoService.addNewToGallery();
      this.photos.unshift(capturedPhoto);
    }else{
      const toast = await this.toastController.create({
        color: 'dark',
        duration: 2000,
        message: 'Si possono allegare massimo tre foto!',
      });
      await toast.present();      
    }
  }


  /**
   * GPS detail data toat
   */

  async presentToastWithOptions() {
    let gps_data = "";
    for(let key of Object.keys(this.lastcoords)){
      gps_data+=key+": "+this.lastcoords[key]+"\n";
    };
    const toast = await this.toastController.create({
      header: 'GPS Data',
      message: gps_data,
      position: 'top',
      buttons: [
       {
          text: 'Done',
          role: 'cancel',
          handler: () => {
            
          }
        }
      ]
    });
    toast.present();
  }

  /**
   * Geolocation init 
   */

  public geolocationInit(){
    this.geolocation.getCurrentPosition().then((resp) => {
      this.coords.push({
        latitude:resp.coords.latitude,
        longitude:resp.coords.latitude,
        altitude: resp.coords.altitude,
        accuracy:resp.coords.accuracy,
        timestamp:resp.timestamp
      });
      this.lastcoords = this.coords[this.coords.length-1];
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    this.geoLocationWatch = this.geolocation.watchPosition({maximumAge: 1000, timeout: 5000, enableHighAccuracy: true});
    this.geoLocationWatch.subscribe((resp) => {
      this.geoLocationWatchStarted = true;
      if("coords" in resp){
        this.coords.push({
          latitude:resp.coords.latitude,
          longitude:resp.coords.longitude,
          altitude: resp.coords.altitude,
          accuracy:resp.coords.accuracy,
          timestamp:resp.timestamp
        });
        this.lastcoords = this.coords[this.coords.length-1];

        this.gpsPositionVectorSource.clear();
        let gpsPositionFeature = new Feature();
        
        gpsPositionFeature.setGeometry(this.lastcoords.longitudine&&this.lastcoords.latitudine ? new Point(fromLonLat([this.lastcoords.longitudine, this.lastcoords.latitudine])) : null);
        this.gpsPositionVectorSource.addFeature(gpsPositionFeature)

        if(this.surveyId=="0"){
          this.olMapComponent.centerOn(this.lastcoords.longitude,this.lastcoords.latitude);
        }
      }
    });

    //https://ionicframework.com/docs/native/geolocation
    /*this.geoLocationWatch = this.geolocation.watchPosition({maximumAge:1000});
    this.geoLocationWatch.subscribe(
      (data: any) => {
        // data can be a set of coordinates, or an error (if an error occurred).
        // data.coords.latitude
        // data.coords.longitude
        this.coords = data.coords;
        console.log(this.coords);
      },
      (error) => {
        console.log(error); //error handling
      } 
    );*/
    ////https://dev.to/saviosantos0808/real-time-localization-using-ionic-framework-and-google-spreadsheets-35pe
    /*this.geolocation.watchPosition(options).subscribe(async(response: any)=>{
      this.coords = response.coords;
      console.log(this.coords);
    });*/
  }

  /**
   * OpenLayers Map Init
   * @param event 
   */

  public onMapReady(event) {
    console.log("Map Ready");
    this.map = event;
    this.addSurveyPositionToMap();
    this.addGPSToMap();

    //https://forum.ionicframework.com/t/generating-a-openlayers-map-as-a-component/161373/4
    setTimeout(()=>{
      this.map.updateSize();
    },500);
  }

  public addSurveyPositionToMap(): void{
    var vector = null;

    var textFill = new Fill({
      color: '#fff',
    });
    var textStroke = new Stroke({
      color: 'rgba(0, 0, 0, 0.6)',
      width: 3,
    });
    
    function styleFunction(feature, resolution) {
      var style = new Style({
          image: new Circle({
            radius: 10,
            fill: new Fill({
              color: '#AA0000'
            }),
            stroke: new Stroke({
              color: '#fff',
              width: 2
            })
          })
        });
      return style;
    }

    vector = new VectorLayer({
      source: this.surveyPositionVectorSource,
      style: styleFunction
    });

    this.map.addLayer(vector);

  }

  public addGPSToMap(): void{
    var vector = null;
    
    function styleFunction(feature, resolution) {
      var style = new Style({
          image: new Circle({
            radius: 5,
            fill: new Fill({
              color: '#0000AA'
            }),
            stroke: new Stroke({
              color: '#fff',
              width: 2
            })
          })
        });
      return style;
    }

    vector = new VectorLayer({
      source: this.gpsPositionVectorSource,
      style: styleFunction
    });

    this.map.addLayer(vector);

  }


}
