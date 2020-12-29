// firebase.service.ts
import { Injectable } from '@angular/core';

//https://www.freakyjolly.com/ionic-firebase-crud-operations/#.X-mQOulKiEI
import { AngularFirestore } from '@angular/fire/firestore';

import { CoreFacade } from "../storage/core.facade";
import { User } from 'src/app/services/storage/user';


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

  create_document(data) {
    
    data['userUID']=this.user.uid;
    return this.firestore.collection(this.collectionName).add(data);
  }
  //https://www.freakyjolly.com/ionic-firebase-crud-operations/#.X-mQOulKiEI
  read_collection() {
    
    return this.firestore.collection(
      this.collectionName,
      //https://stackoverflow.com/questions/49026589/angular-firestore-where-query-returning-error-property-does-not-exist-on
      //.where("userUID", "==", firebase.auth().currentUser.uid)
      ref => ref.where("userUID", "==", this.user.uid)
      )
      .snapshotChanges();
  }

  read_document(documentID) {
    return this.firestore.doc(this.collectionName + '/' + documentID).snapshotChanges();
  }

  update_document(documentID, data) {
    this.firestore.doc(this.collectionName + '/' + documentID).update(data);
  }

  delete_document(documentID) {
    this.firestore.doc(this.collectionName + '/' + documentID).delete();
    
  }
  
}