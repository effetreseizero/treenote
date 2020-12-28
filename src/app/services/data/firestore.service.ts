// firebase.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  collectionName = 'surveys';

  constructor(
    private firestore: AngularFirestore
  ) { }

  create_survey(record) {
    return this.firestore.collection(this.collectionName).add(record);
  }

  read_surveys() {
    return this.firestore.collection(this.collectionName).snapshotChanges();
  }

  update_survey(recordID, record) {
    this.firestore.doc(this.collectionName + '/' + recordID).update(record);
  }

  delete_survey(record_id) {
    this.firestore.doc(this.collectionName + '/' + record_id).delete();
  }
}