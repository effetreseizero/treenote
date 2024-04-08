// firebase.service.ts
import { Injectable } from '@angular/core';

//https://www.freakyjolly.com/ionic-firebase-crud-operations/#.X-mQOulKiEI
import { FirebaseApp } from '@angular/fire/compat';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { CoreFacade } from "../storage/core.facade";
import { User } from 'src/app/services/storage/user';

import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { from, TimeoutError } from 'rxjs';

import {compress, compressAccurately} from 'image-conversion';


@Injectable({
  providedIn: 'root'
})
export class SurveysService {

  user: User = null;

  collectionName = 'surveys';

  constructor(
    private firestore: AngularFirestore,
    private fireauth: AngularFireAuth,
    private firestorage: AngularFireStorage,
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
  read_user_surveys_collection() {

    return this.firestore.collection(
      this.collectionName,
      //https://stackoverflow.com/questions/49026589/angular-firestore-where-query-returning-error-property-does-not-exist-on
      //.where("userUID", "==", firebase.auth().currentUser.uid)
      ref => ref.where("user_uid", "==", this.user.uid)
      )
      .snapshotChanges();

  }

  read_sent_surveys_collection() {
    console.log("read_sent_surveys_collection");
    return this.firestore.collection(
      this.collectionName,
      //https://stackoverflow.com/questions/49026589/angular-firestore-where-query-returning-error-property-does-not-exist-on
      //.where("userUID", "==", firebase.auth().currentUser.uid)
      ref => ref.where("status", "==", "sent")
      )
      .snapshotChanges();

  }

  read_review_surveys_collection() {
    console.log("read_review_surveys_collection");
    return this.firestore.collection(
      this.collectionName,
      //https://stackoverflow.com/questions/49026589/angular-firestore-where-query-returning-error-property-does-not-exist-on
      //.where("userUID", "==", firebase.auth().currentUser.uid)
      ref => ref.where("status", "==", "review")
      )
      .snapshotChanges();

  }

  read_archive_surveys_collection() {
    console.log("read_archive_surveys_collection");
    return this.firestore.collection(
      this.collectionName,
      //https://stackoverflow.com/questions/49026589/angular-firestore-where-query-returning-error-property-does-not-exist-on
      //.where("userUID", "==", firebase.auth().currentUser.uid)
      ref => ref.where("status", "==", "archive")
      )
      .snapshotChanges();

  } 

  async create_surveys_document(data,photos) {
    data['user_uid']=this.user.uid;
    data['user_email']=this.user.email;
    data['deleted']=false;
    data['status']="sent";
    //https://www.nuomiphp.com/eplan/en/2152.html
    let dt = new Date();
    data['created_time']=dt.getTime();
    debugger;
    try {
      

      // If Online Upload the image to Cloud Storage.
      if(navigator.onLine){
        const messageRef = await this.firestore.collection(this.collectionName).add(data);
        const promiseArray = [];
        for (let i=0;i<photos.length; i++){
          
          let blob = await fetch(photos[i].webviewPath).then(r => r.blob());
          //compress
          //https://github.com/WangYuLue/image-conversion
          //https://stackoverflow.com/questions/14672746/how-to-compress-an-image-via-javascript-in-the-browser

          promiseArray.push(compress(blob,{
              quality: 0.7,
              height: 1080,
          }))
        }
        await Promise.all(promiseArray).then((values)=>{
          for(let i=0;i<values.length;i++){
            var filePath = 'users_photo/'+this.user.uid + '/' + messageRef.id + '/' + i +"."+photos[i].filetype;
            // Create file metadata including the content type
            var metadata = {
              contentType: 'image/'+photos[i].filetype,
            };
            this.firestorage.ref(filePath).put(values[i],metadata).then((fileSnapshot)=>{
              fileSnapshot.ref.getDownloadURL().then((url)=>{
                let imagedata = {};
                imagedata["photo_"+i+"_imageurl"] = url;
                imagedata["photo_"+i+"_storageuri"] = fileSnapshot.metadata.fullPath;
                messageRef.update(imagedata);
              });
            });
          }
        })
      }
      else{
        /*
        TO DO UPLOAD OFFILE PHOTO
        */
        this.firestore.collection(this.collectionName).add(data);
      }
    } catch (error) {
      console.error('There was an error uploading a file to Cloud Storage:', error);
    }
  }


  read_surveys_document(surveyID) {
    console.log("read_surveys_document");
    return this.firestore.doc(this.collectionName + '/' + surveyID).get();
  }

  async update_surveys_document(surveyID, data, photos) {
    console.log("update_surveys_document");
    await this.firestore.doc(this.collectionName + '/' + surveyID).update(data);
    if(photos.length>0){
      try {
        // 2 - Upload the image to Cloud Storage.

        //delete photo field

        let imagedata = {};
        for(let i=0;i<3;i++){
          imagedata["photo_"+i+"_imageurl"] = ""
          imagedata["photo_"+i+"_storageuri"] = "";
                
        }
        await this.firestore.doc(this.collectionName + '/' + surveyID).update(imagedata);
        const promiseArray = [];
        for (let i=0;i<photos.length; i++){
          
          let blob = await fetch(photos[i].webviewPath).then(r => r.blob());
          //compress
          //https://github.com/WangYuLue/image-conversion
          //https://stackoverflow.com/questions/14672746/how-to-compress-an-image-via-javascript-in-the-browser

          promiseArray.push(compress(blob,{
              quality: 0.7,
              height: 1080,
          }))
        }
        await Promise.all(promiseArray).then((values)=>{
          for(let i=0;i<values.length;i++){
            var filePath = 'users_photo/'+this.user.uid + '/' + surveyID + '/' + i +"."+photos[i].filetype;
            // Create file metadata including the content type
            var metadata = {
              contentType: 'image/'+photos[i].filetype,
            };
            this.firestorage.ref(filePath).put(values[i],metadata).then((fileSnapshot)=>{
              fileSnapshot.ref.getDownloadURL().then((url)=>{
                let imagedata = {};
                imagedata["photo_"+i+"_imageurl"] = url;
                imagedata["photo_"+i+"_storageuri"] = fileSnapshot.metadata.fullPath;
                this.firestore.doc(this.collectionName + '/' + surveyID).update(imagedata);
              });
            });
          }
        })
      } catch (error) {
        console.error('There was an error uploading a file to Cloud Storage:', error);
      }
    }
  }

  async delete_surveys_document(surveyID) {
    
    //delete survey photos directory
    this.firestore.doc(this.collectionName + '/' + surveyID).get().toPromise().then((survey)=>{
      var surveyStoragePath = 'users_photo/'+this.user.uid + '/' + surveyID;
      Promise.all([
        //https://bezkoder.com/firebase-storage-angular-10-file-upload/
        this.firestorage.ref(surveyStoragePath).child("0.jpeg").delete(),
        this.firestorage.ref(surveyStoragePath).child("1.jpeg").delete(),
        this.firestorage.ref(surveyStoragePath).child("2.jpeg").delete(),
      ]).then(()=>{
        //then mark as deleted
        //https://www.nuomiphp.com/eplan/en/2152.html
        let data =
        {
          deleted: true,
          deletedTime: Date.now()
  
        }
        this.firestore.doc(this.collectionName + '/' + surveyID).update(data);
      })
    });
    
  }

  
  
}