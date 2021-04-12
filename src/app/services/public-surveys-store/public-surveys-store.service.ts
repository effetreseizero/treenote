import { CoreState } from './core.state';
import { Store } from './abstract.store';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';


//https://www.freakyjolly.com/ionic-firebase-crud-operations/#.X-mQOulKiEI
import { AngularFireStorage } from '@angular/fire/storage';

//https://www.techiediaries.com/angular-local-json-files/
import { HttpClient } from "@angular/common/http";



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
    private httpClient: HttpClient
  ) { 

    super(new CoreState());

    this.ready$ = Promise.all([
      this.firestorage.ref('public_surveys/public_surveys.geojson').getDownloadURL().toPromise().then( url =>{
        this.geojson_url = url;
        return this.httpClient.get(this.geojson_url).toPromise().then(data =>{
          this.setStateValue(data);
          return data;
        }).catch(_ => {
          this.setStateValue(undefined);
          return undefined;
        })
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

  updatePublicSurveys(){
    /*
    var filePath = 'public_surveys/'+this.user.uid + '/' + messageRef.id + '/' + i +"."+photos[i].filetype;
        // Create file metadata including the content type
        var metadata = {
          contentType: 'image/'+photos[i].filetype,
        };
        let blob = await fetch(photos[i].webviewPath).then(r => r.blob());
        const fileSnapshot = await this.firestorage.ref(filePath).put(blob,metadata);
        const url = await fileSnapshot.ref.getDownloadURL();
        let imagedata = {};
        imagedata["photo_"+i+"_imageurl"] = url;
        imagedata["photo_"+i+"_storageuri"] = fileSnapshot.metadata.fullPath;
        await messageRef.update(imagedata);
      */
  }

  private setStateValue(value: any): void {
    this.state = value;
  }
}
