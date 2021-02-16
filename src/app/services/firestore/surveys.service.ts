// firebase.service.ts
import { Injectable } from '@angular/core';

//https://www.freakyjolly.com/ionic-firebase-crud-operations/#.X-mQOulKiEI
import { AngularFirestore } from '@angular/fire/firestore';

import { CoreFacade } from "../storage/core.facade";
import { User } from 'src/app/services/storage/user';

import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { TimeoutError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SurveysService {

  user: User = null;

  collectionName = 'surveys';

  constructor(
    private firestore: AngularFirestore,
    private coreFacade: CoreFacade
  ) { 
    
    this.user=null;
    this.coreFacade.getUser().subscribe((user)=>{
      this.user=user;
    });
  }

  ngOnInit() {
    

  }

  //https://www.freakyjolly.com/ionic-firebase-crud-operations/#.X-mQOulKiEI
  read_surveys_collection() {
    console.log("fsurveysService.read_surveys_collection")

    return this.firestore.collection(
      this.collectionName,
      //https://stackoverflow.com/questions/49026589/angular-firestore-where-query-returning-error-property-does-not-exist-on
      //.where("userUID", "==", firebase.auth().currentUser.uid)
      ref => ref.where("user_uid", "==", this.user.uid)
      )
      .snapshotChanges();

  }

  create_survey_document(data) {
    data['user_uid']=this.user.uid;
    data['deleted']=false;
    //https://www.nuomiphp.com/eplan/en/2152.html
    debugger;
    let dt = new Date();
    data['created_time']=dt.getTime();
    data['data_osservazione']= dt.toLocaleDateString();
    data['ora_osservazione']= dt.toLocaleTimeString();
    return this.firestore.collection(this.collectionName).add(data);
  }

  read_surveys_document(surveyID) {
    return this.firestore.doc(this.collectionName + '/' + surveyID).snapshotChanges();
  }

  update_surveys_document(surveyID, data) {
    this.firestore.doc(this.collectionName + '/' + surveyID).update(data);
  }

  delete_surveys_document(surveyID) {
    //https://www.nuomiphp.com/eplan/en/2152.html
    let data =
    {
      deleted: true,
      deletedTime: Date.now()

    }
    this.firestore.doc(this.collectionName + '/' + surveyID).update(data);
    
  }

  
  
}