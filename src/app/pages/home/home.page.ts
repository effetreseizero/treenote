import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { Router, RouterEvent } from '@angular/router';

import { PopoverController } from '@ionic/angular';

import { SurveyPreviewPopoverComponent } from '../../components/survey-preview-popover/survey-preview-popover.component';
import { HelperPopoverComponent } from '../../components/helper-popover/helper-popover.component';


import { AuthenticationService } from "../../services/auth/authentication.service";
import {CoreFacade} from "../../services/storage/core.facade"

import { AngularFireStorage } from '@angular/fire/storage';

import { SurveysService} from '../../services/firestore/surveys.service';

import { UserOptionsService } from '../../services/options/user-options.service'

//https://medium.com/runic-software/a-simple-guide-to-openlayers-in-angular-b10f6feb3df1
import {OlMapComponent} from '../../components/ol-map/ol-map.component';
import {Map,View, Feature} from "ol";
import {Vector as VectorSource ,OSM,Cluster} from "ol/source";
import {GeoJSON} from "ol/format";
import {Style,Icon,Fill,Circle,Stroke, Text as TextStyle, RegularShape} from 'ol/style';
import {Tile,WebGLPoints,Layer, Vector as VectorLayer} from "ol/layer";
import {Point} from "ol/geom";
import { fromLonLat } from "ol/proj";

import {createEmpty, extend, getHeight, getWidth} from 'ol/extent';



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
  publicSurveysVectorSource= new VectorSource({
    features: []
  });

  constructor(
    private router: Router,
    private popoverController: PopoverController,
    public authService: AuthenticationService,
    private coreFacade: CoreFacade,
    private surveyService: SurveysService,
    private userOptionsService: UserOptionsService,
    private firestorage: AngularFireStorage,
  ) {}


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
        return survey;
      });
      this.publicSurveysVectorSource.clear();
      this.publicSurveysList.forEach((survey)=>{
        let surveyPositionFeature = new Feature();
        surveyPositionFeature.setProperties(survey);
        surveyPositionFeature.setGeometry(survey.longitudine&&survey.latitudine ? new Point(fromLonLat([survey.longitudine, survey.latitudine])) : null);
        this.publicSurveysVectorSource.addFeature(surveyPositionFeature)
      });
    });

  }

  ionViewDidEnter(){
    let showGuide = this.userOptionsService.getShowHomeGuide();

    setTimeout(async ()=>{
      let popover;
      if(this.user){
        popover = await this.popoverController.create({
          component: HelperPopoverComponent,
          cssClass: 'popover_setting',
          componentProps: {
            message: {
              imageurl: "../../assets/images/helper_home_add.png",
              title: "Segnalazione",
              text: "Inviaci una segnalazione con questo bottone o dalla voce di menu Segnalazioni"
            }
          },
          translucent: true
        });
      }else{
        popover = await this.popoverController.create({
          component: HelperPopoverComponent,
          cssClass: 'popover_setting',
          componentProps: {
            message: {
              imageurl: "../../assets/images/helper_home_partecipa.png",
              title: "Iscriviti",
              text: "Mandaci le tue segnalazioni sullo stato di salute delle piante"
            }
          },
          translucent: true
        });
      }
      
      await popover.present();
      
  
    },5000);
  }
  

  public logIn(): void{
    this.router.navigate(['/menu/login']);
  }

  public userAccout(): void{
    this.router.navigate(['/menu/user-account']);
  }

  async createSurvey() {
    this.router.navigate(['/menu/survey-edit']);
  }

  async surveyPreviewPopover(ev: any,survey) {
    this.surveyService.read_surveys_document(survey.id).subscribe(async (survey)=>{
      const popover = await this.popoverController.create({
        component: SurveyPreviewPopoverComponent,
        event: ev,
        cssClass: 'popover_setting',
        componentProps: {
          survey: survey.data()
        },
        translucent: true
      });
      popover.onDidDismiss().then((result) => {
        console.log(result.data);
      });

      return await popover.present();
      /** Sync event from popover component */
    });
    

  }
  

  /**
   * Openlayers MAP managment
   * @param event 
   */
  public onMapReady(event) {
    this.map = event;

    this.addPublicSurveysToMap();

    /**
     * ad click cluster animation
     */
    this.map.on('singleclick', event => {
      // get the feature you clicked
      const feature = this.map.forEachFeatureAtPixel(event.pixel, (feature) => {
       return feature
      })
      if(feature instanceof Feature){
        // Fit the feature geometry or extent based on the given map
        let features = feature.getProperties().features;
        //zoom to feature cluster
        if(features.length > 1){
          var extent = features[0].getGeometry().getExtent().slice(0);
          features.forEach(function(feature){ extend(extent,feature.getGeometry().getExtent())});

          this.map.getView().fit(extent);
          this.map.getView().setZoom(this.map.getView().getZoom()-1);
        }
        //open popover with survey preview
        else{
          this.surveyPreviewPopover(SurveyPreviewPopoverComponent,features[0].getProperties());
        }
        
      }
     })
    
  }

  public addPublicSurveysToMap(): void{
    var vector = null;

    var textFill = new Fill({
      color: '#fff',
    });
    var textStroke = new Stroke({
      color: 'rgba(0, 0, 0, 0.6)',
      width: 3,
    });
    
    function styleFunction(feature, resolution) {
      var style;
      var size = feature.get('features').length;
      if (size > 1) {
        //https://krazydad.com/tutorials/makecolors.php
        let frequency = .3;
        let i = size%32
        let red   = Math.sin(frequency*i + 0) * 127 + 128;
        let green = Math.sin(frequency*i + 2) * 127 + 128;
        let blue  = Math.sin(frequency*i + 4) * 127 + 128;
        let fill = new Fill({
          color: [red, green, blue, 0.2],
        });
        /*
        if(size>=5&&size<10){
          fill = new Fill({
            color: [153, 255, , 0.6],
          });
        }
        if(size>=10){
          fill = new Fill({
            color: [153, 0, 255 , 0.6],
          });
        }
        */
        style = new Style({
          image: new Circle({
            radius: size>10?50:size*5,
            fill: fill,
          }),
          text: new TextStyle({
            text: size.toString(),
            fill: textFill,
            stroke: textStroke,
          }),
        });
      } else {
        style = new Style({
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
      }
      return style;
    }

    var pathReference = this.firestorage.ref('public_surveys/public_surveys.geojson');

    // Get the download URL
    pathReference.getDownloadURL().subscribe((geojson_url) => {
      var publicSurveysVectorSource = new VectorSource({
        url: geojson_url,
        format: new GeoJSON
     });
      
      var clusterSource = new Cluster({
        distance: 70,
        source: publicSurveysVectorSource,
      });
  
      vector = new VectorLayer({
        source: clusterSource,
        style: styleFunction
      });
  
      this.map.addLayer(vector);
    });


    //https://forum.ionicframework.com/t/generating-a-openlayers-map-as-a-component/161373/4
    setTimeout(()=>{
      this.map.updateSize();
    },500);

  }

}


