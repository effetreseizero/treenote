import { CoreState } from './core.state';
import { Store } from './abstract.store';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';


//https://www.freakyjolly.com/ionic-firebase-crud-operations/#.X-mQOulKiEI
import { AngularFireStorage } from '@angular/fire/storage';

//https://www.techiediaries.com/angular-local-json-files/
import { HttpClient } from "@angular/common/http";


import { SurveysService} from '../../services/firestore/surveys.service';



import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { TimeoutError } from 'rxjs';
import { FirebaseApp } from '@angular/fire';


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
        debugger;
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
      debugger;
      let publicSurveyRecord= {
        "type": "Feature",
        "properties": { 
          "id": data.id,
          "localita": data.data()["localita"],
          "data_ora_osservazione": data.data()["data_ora_osservazione"],
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
        debugger;
        let data = {
          status: "public"
        }
        this.surveysService.update_surveys_document(surveyId, data);
      });
    });
  }

  private setStateValue(value: any): void {
    this.state = value;
  }
}
