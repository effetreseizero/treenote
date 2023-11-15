//https://www.freakyjolly.com/ionic-firebase-crud-operations/#.X-2m2On0mEJ

//https://www.joshmorony.com/advanced-forms-validation-in-ionic-2/



import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';

import { Router, ActivatedRoute, RouteReuseStrategy } from '@angular/router';
import { IonContent,IonSlides, NavController,Platform, ToastController  } from '@ionic/angular';

import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';

import { SurveysService} from '../../services/firestore/surveys.service';
import { Survey} from '../../services/firestore/survey';

import { AlertController } from '@ionic/angular';

import { ModalController } from '@ionic/angular';
import { InfoListPage } from '../../modal/info-list/info-list.page';

import { PopoverController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';


import { SurveyHelperPopoverComponent } from '../../components/survey-helper-popover/survey-helper-popover.component';



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
import { fromLonLat , transform} from "ol/proj";


import IconAnchorUnits from 'ol/style/IconAnchorUnits';
import IconOrigin from 'ol/style/IconOrigin';


//https://dev.to/saviosantos0808/real-time-localization-using-ionic-framework-and-google-spreadsheets-35pe
import { Geolocation } from '@ionic-native/geolocation/ngx';

//https://firebase.google.com/docs/firestore/solutions/geoqueries
import{ geohashForLocation } from 'geofire-common';
import{ coordinateRelationship } from 'ol/extent';


//https://stackoverflow.com/questions/58651389/router-guards-in-angular-8
import { CanComponentDeactivate} from '../../services/deactivate/deactivate.guard';

import { LoadingController } from '@ionic/angular';
import { OlMapComponentSurvey } from 'src/app/components/ol-map-survey/ol-map-survey.component';

import { UserOptionsService } from '../../services/options/user-options.service';


@Component({
  selector: 'app-survey-edit',
  templateUrl: './survey-edit.page.html',
  styleUrls: ['./survey-edit.page.scss'],
})
export class SurveyEditPage implements OnInit,CanComponentDeactivate {
  @ViewChild(IonContent) content: IonContent;

  public surveyId = "0";
  public surveyEmail="";
  public survey=null;

  public editable = true;
  public newsurvey = false;

  public avanzateActivated = false;

  public surveyForm: UntypedFormGroup;
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
  @ViewChild('app_ol_map_survey') olMapComponentSurvey:OlMapComponentSurvey;
  map: Map;
  baseMap: String;

  preventBack = true;

  //https://stackoverflow.com/questions/58651389/router-guards-in-angular-8
  canDeactivate =  () => {
    console.log('back button');
    if(this.preventBack){
      this.cancelEdit();
      

      //https://stackoverflow.com/questions/12381563/how-can-i-stop-the-browser-back-button-using-javascript
      history.pushState(null, document.title, location.href);
      return false;
    } else {
      return true;
    }
  };

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
  gpsPositionSetted = false;

 

  constructor(
    private activatedRoute:ActivatedRoute,
    private navController: NavController,
    private router:Router,
    public formBuilder: UntypedFormBuilder,
    private surveysService:SurveysService,
    private alertController:AlertController,
    private toastController:ToastController,
    private geolocation: Geolocation,
    public photoService: PhotoService,
    public modalController: ModalController,
    public loadingController: LoadingController,
    private popoverController: PopoverController,
    public actionSheetController: ActionSheetController,
    private userOptionsService: UserOptionsService,
    public platform: Platform

  ) {


    this.surveyForm = this.formBuilder.group({
      data_ora_osservazione: ['', [Validators.required]],
      localita: ['', [Validators.required]],
      tipologia: ['', [Validators.required]],
      identificazione: ['', [Validators.required]],      
      nome_comune: ['',[]],
      loc_problema: ['', [Validators.required]],
      commenti: ['', []],
      avanzate: ['', []],
      specie: ['', []],
      nome_scientifico: ['',[]],
      sintomo_0: ['', []],
      sintomo_1: ['', []],
      sintomo_2: ['', []],
      diffusione_perc: ['', []],
      alberi_morti: ['', []],
    });

    


  }

  

  ngOnInit() {

    this.geolocationInit();

    //https://ionicacademy.com/pass-data-angular-router-ionic-4/
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {

        this.surveyId = this.router.getCurrentNavigation().extras.state.id;

        //read survey data

        this.surveysService.read_surveys_document(this.surveyId).subscribe((data)=>{

          this.newsurvey = false;
          this.survey=data.data();
          this.surveyEmail = this.survey.user_email;

          //https://angular.io/guide/deprecations#ngmodel-with-reactive-forms
          //https://ultimatecourses.com/blog/angular-2-form-controls-patch-value-set-value
          this.surveyForm.patchValue(this.survey);

          if(this.survey["status"]==="public"||this.survey["status"]==="archive"){
            this.editable = false;
            this.surveyForm.disable();
          }

          this.avanzateActivated = this.surveyForm.get("avanzate").value;

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

          this.olMapComponentSurvey.centerOn(this.survey.longitudine,this.survey.latitudine);
          this.gpsPositionSetted=true;
        });
      }else{
        this.surveyId = "0";

        this.newsurvey = true;
        this.editable = true;

        this.surveyForm.get('data_ora_osservazione').patchValue(this.formatDate(new Date()));
        
        this.avanzateActivated = false;

        this.surveyForm.get("avanzate").setValue(false);
        
        /*
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
          sintomo_0: "010_avvizzimento_fogliare",
          sintomo_1: "010_avvizzimento_fogliare",
          sintomo_2: "010_avvizzimento_fogliare",
          diffusione_perc: "010_minore_20",
          alberi_morti: "010_si",
        });
        */

        this.surveyForm.get("avanzate").valueChanges.subscribe(async (checked)=>{
          if(!checked){
            const alert = await this.alertController.create({
              header: 'Le informazioni avanzate saranno cancellate. Confermi?',
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: () => {
                    this.surveyForm.patchValue({
                      avanzate: true
                    });
                    this.avanzateActivated = true;
                  }
                },
                {
                  text: 'Ok',
                  handler: () => {
                    this.surveyForm.patchValue({
                      specie: "",
                      nome_scientifico: "",
                      sintomo_0: "",
                      sintomo_1: "",
                      sintomo_2: "",
                      diffusione_perc: "",
                      alberi_morti: "", 
                    });
                    this.avanzateActivated = false;
                  }
                }
              ]
            });
        
            await alert.present();
          } else {
            this.avanzateActivated = true;
          } 
        });
        
      }
    });

    //https://www.tektutorialshub.com/angular/valuechanges-in-angular-forms/#:~:text=The%20ValueChanges%20is%20an%20event,time%20and%20respond%20to%20it.
        
  }


  ionViewDidEnter(){
    this.userOptionsService.readSurveyHelper().then((toshow)=>{
      if(!toshow.value){
        setTimeout(async ()=>{
          let popover = await this.popoverController.create({
              component: SurveyHelperPopoverComponent,
              cssClass: 'popover_setting',
              translucent: true
            });
          
          await popover.present();          
      
        },500);
      }
    });
  }
  

  private formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    let hours = ''+d.getHours();
    let minutes = ''+d.getMinutes();
    return [year, month, day].join('-')+' '+hours+":"+minutes;
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
              this.preventBack = false;
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
    } else if(this.photos.length==0){
      this.surveySlider.slideTo(1);
    } else if(!this.gpsPositionSetted){
      this.surveySlider.slideTo(2);
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
            handler: async () => {
              const loading = await this.loadingController.create({
                cssClass: 'my-custom-class',
                message: 'Invio dati ...',
              });
              await loading.present();
              if(this.surveyId=="0"){
                this.surveysService.create_surveys_document(this.surveyForm.value,this.photos).then(async()=>{
                  loading.dismiss();
                  const toast = await this.toastController.create({
                    color: 'secondary',
                    position: 'middle',
                    duration: 4000,
                    message: 'Grazie per la segnalazione!<br>Sarà presa in carico dal nostro team al più presto.',
                  });
                  await toast.present().then(()=>{
                    this.preventBack = false;
                    this.navController.back();
                  }); 
                });
              }else{
                this.surveysService.update_surveys_document(this.surveyId, this.surveyForm.value,this.photos).then(()=>{
                  loading.dismiss();
                  this.preventBack = false;
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


  async sintomiInfo(){
    const modal = await this.modalController.create({
      component: InfoListPage,
    });
    return await modal.present();
    
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


  async addPhotoToGallery(position) {
    if(this.photos.length<3){
      let role = "";
      if(this.platform.is("desktop")){
        role = "PHOTOS"
      } else{
        const actionSheet = await this.actionSheetController.create({
          header: 'Aggiungi foto',
          buttons: [
            {
              text: 'Fotocamera',
              icon: 'camera-outline',
              role: 'CAMERA',
              handler: () => {
              }
            }, {
              text: 'Galleria',
              icon: 'images-outline',
              role: 'PHOTOS',
              handler: () => {
              }
            }
          ]
        });
        await actionSheet.present();
    
         role = await (await actionSheet.onDidDismiss()).role;
      }
      const capturedPhoto = await this.photoService.addNewToGallery(role);
      if(position!=null){
        this.photos[position]= capturedPhoto;
      }else{
        this.photos.push(capturedPhoto);
      }
    }else{
      const toast = await this.toastController.create({
        color: 'dark',
        duration: 2000,
        message: 'Si possono allegare massimo tre foto!',
      });
      await toast.present();      
    }
  }

  async removePhoto(position) {
    const alert = await this.alertController.create({
      header: 'Rimuovere la foto?',
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
            this.photos.splice(position,1);
          }
        }
      ]
    });
  
    await alert.present();
  }

  getGpsPosition(){
    this.geolocation.getCurrentPosition().then((resp) => {
      this.surveyForm.value["latitudine"]=resp.coords.latitude;
      this.surveyForm.value["longitudine"]=resp.coords.longitude;
      this.surveyForm.value["quota"]=resp.coords.altitude||0;
      this.surveyForm.value["accuratezza"]=resp.coords.accuracy||-1;

      this.gpsPositionSetted = true;

      this.surveyPositionVectorSource.clear();
      let surveyPositionFeature = new Feature();
      
      surveyPositionFeature.setGeometry(new Point(fromLonLat([this.surveyForm.value["longitudine"], this.surveyForm.value["latitudine"]])));
      this.surveyPositionVectorSource.addFeature(surveyPositionFeature)

      this.olMapComponentSurvey.centerOn(this.surveyForm.value["longitudine"],this.surveyForm.value["latitudine"]);

      this.presentToastWithOptions();
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  centerOnGPS(){
    this.geolocation.getCurrentPosition().then((resp) => {
      this.olMapComponentSurvey.centerOn(resp.coords.longitude,resp.coords.latitude);
      
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  async getMapPosition(){
    const toast = await this.toastController.create({
      header: 'Posizione della segnalazionie',
      message: "Indica sulla mappa la posizione",
      position: 'bottom',
      buttons: [
       
      ],
      duration: 2000
    });
    toast.present();


    let mapClickCB = (evt)=>{
      // convert coordinate to EPSG-4326
      let coords = transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
      this.surveyForm.value["latitudine"]=coords[1];
      this.surveyForm.value["longitudine"]=coords[0];
      this.surveyForm.value["quota"]=0;
      this.surveyForm.value["accuratezza"]=1;

      this.gpsPositionSetted = true;

      this.surveyPositionVectorSource.clear();
      let surveyPositionFeature = new Feature();
      
      surveyPositionFeature.setGeometry(new Point(fromLonLat([this.surveyForm.value["longitudine"], this.surveyForm.value["latitudine"]])));
      this.surveyPositionVectorSource.addFeature(surveyPositionFeature)

      this.olMapComponentSurvey.centerOn(this.surveyForm.value["longitudine"],this.surveyForm.value["latitudine"]);

      this.presentToastWithOptions();
      this.map.un('singleclick', mapClickCB);
    };
    this.map.on('singleclick', mapClickCB);
  }




  /**
   * GPS detail data toat
   */

  async presentToastWithOptions() {
    let gps_data = "";
    gps_data+="<p>Latitudine: "+this.surveyForm.value["latitudine"];
    gps_data+="<\p><p>Longitudine: "+this.surveyForm.value["longitudine"];
    gps_data+="<\p><p>Quota: "+this.surveyForm.value["quota"];
    gps_data+=" Accuratezza: "+this.surveyForm.value["accuratezza"]+"";
    const toast = await this.toastController.create({
      header: 'Coordinate della segnalazione',
      message: gps_data,
      position: 'top',
      buttons: [
       {
          text: 'Chiudi',
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

        if(this.newsurvey){
          this.olMapComponentSurvey.centerOn(this.lastcoords.longitude,this.lastcoords.latitude);
        }
      }
    });

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
    
    var iconStyle = new Style({
      image: new Icon(/** @type {olx.style.IconOptions} */ ({
        anchor: [0.5, 0],
        scale: 0.3,
        anchorOrigin: IconOrigin.BOTTOM_LEFT, 
        anchorXUnits: IconAnchorUnits.FRACTION,
        anchorYUnits: IconAnchorUnits.PIXELS,
        opacity: 1,
        src: '../../assets/icon/map_poi.png'
      }))
    });

    function styleFunction(feature, resolution) {
      var style = iconStyle;
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

  switchBaseMap(){
    if(this.baseMap==="WSM"){
      this.olMapComponentSurvey.setMapType("WI");
      this.baseMap="WI";
    }else{
      this.olMapComponentSurvey.setMapType("WSM");
      this.baseMap="WSM";
    }
  }

  async showMapAttributions() {
    const toast = await this.toastController.create({
      message: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' + 'rest/services/World_Imagery/MapServer">ArcGIS</a>',
      duration: 2000,
      color:"light"
    });
    toast.present();
  }


}
