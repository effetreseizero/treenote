import { CoreState } from './core.state';
import { Store } from './abstract.store';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';


//https://www.freakyjolly.com/ionic-firebase-crud-operations/#.X-mQOulKiEI
import { AngularFireStorage } from '@angular/fire/compat/storage';

//https://www.techiediaries.com/angular-local-json-files/
import { HttpClient } from "@angular/common/http";


import { SurveysService} from '../../services/firestore/surveys.service';



import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { TimeoutError } from 'rxjs';
import { FirebaseApp } from '@angular/fire/compat';


@Injectable({
  providedIn: 'root'
})
export class PublicSurveysStore extends Store<CoreState> {

  public ready$: Promise<any[]>;

  geojson_url = "";

  constructor(
    private firestorage: AngularFireStorage,
    private httpClient: HttpClient,
    private surveysService: SurveysService,
  ) { 

    super(new CoreState());

    this.ready$ = Promise.all([
      this.firestorage.ref('public_surveys/public_surveys.geojson').getDownloadURL().toPromise().then( url =>{
        this.geojson_url = url;
        return this.httpClient.get(this.geojson_url).toPromise().then(data =>{
          this.setStateValue(data);
          return data;
        })
      }).catch(_ => {
        let empty_geojson={
          "type": "FeatureCollection",
          "name": "public_surveys",
          "crs": { 
            "type": "name", 
            "properties": { 
              "name": "urn:ogc:def:crs:OGC:1.3:CRS84" 
            }
          },
          "features": []
        }
        this.setStateValue(empty_geojson);
        return empty_geojson;
      })
    ])
  }

  public getPublicSurveys(): Promise<any> {
    return this.ready$.then(()=>{
      return this.state;
    });
  }
 
  public subscribePublicSurveys(): Observable<any> {
    return this.subscribe();
  }

  async addPublicSurvey(surveyId){
    this.surveysService.read_surveys_document(surveyId).subscribe((data)=>{

      //https://stackoverflow.com/questions/2388115/get-locale-short-date-format-using-javascript/31663241
      var date = new Date(data.data()["data_ora_osservazione"]);
      var options = {
          year: "numeric",
          month: "2-digit",
          day: "numeric",
          hour: "numeric",
          minute:"numeric"
      };
      
      let short_date =  date.toLocaleDateString("it") //en is language option, you may specify..


      let publicSurveyRecord= {
        "type": "Feature",
        "properties": { 
          "id": data.id,
          "localita": data.data()["localita"],
          "short_date": short_date,
        },
        "geometry": {
          "type": "Point", 
          "coordinates": [ 
            data.data()["longitudine"], 
            data.data()["latitudine"]
          ] 
        }  
      }

      
      //add new public survey to the beggining of array
      this.state['features'].unshift(publicSurveyRecord);

      //upload json array in firebase storage
      //https://medium.com/@dorathedev/uploading-json-objects-as-json-files-to-firebase-storage-without-having-or-creating-a-json-file-38ad323af3c4
      var blob = new Blob([JSON.stringify(this.state)], {type: "application/json"})
      return this.firestorage.ref('public_surveys/public_surveys.geojson').put(blob).then(()=>{
        //onse saved, update survey status
        let data = {
          status: "public"
        }
        this.surveysService.update_surveys_status(surveyId, data);
      });
    });
  }

  async removePublicSurvey(surveyId,newStatus){
    this.surveysService.read_surveys_document(surveyId).subscribe((data)=>{

      //fileter out matching id element from publicsurvey array
      this.state['features'] = this.state['features'].filter((x)=>(!(x.properties.id===surveyId)));

      //upload json array in firebase storage
      //https://medium.com/@dorathedev/uploading-json-objects-as-json-files-to-firebase-storage-without-having-or-creating-a-json-file-38ad323af3c4
      var blob = new Blob([JSON.stringify(this.state)], {type: "application/json"})
      return this.firestorage.ref('public_surveys/public_surveys.geojson').put(blob).then(()=>{
        //onse saved, update survey status
        let data = {
          status: newStatus
        }
        this.surveysService.update_surveys_status(surveyId, data);
      });
    });
  }

  private setStateValue(value: any): void {
    this.state = value;
  }
}
