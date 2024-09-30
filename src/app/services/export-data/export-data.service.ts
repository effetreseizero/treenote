//https://bobcares.com/blog/export-data-into-excel-in-ionic-application-using-xlsx/

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';

import { FirebaseApp } from '@angular/fire/compat';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { CoreFacade } from "../storage/core.facade";
import { User } from 'src/app/services/storage/user';

import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { from, TimeoutError } from 'rxjs';

import { compress, compressAccurately } from 'image-conversion';
import { Firestore } from 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class ExportDataService {

  collectionName = 'surveys';
  data = null;

  constructor(
    private firestore: AngularFirestore,
    private fireauth: AngularFireAuth,
    private firestorage: AngularFireStorage,
    private coreFacade: CoreFacade
  ) { }

  async exportSurveyToExcel(surveyID) {

    this.firestore.doc(this.collectionName + '/' + surveyID).get().toPromise().then((document) => 
    {
      this.data = document.data();
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
        [{
          accuratezza: this.data.accuratezza,
          //alberi_morti: data.alberi_morti,
          //avanzate:false,
          commenti: this.data.commenti,
          created_time: this.data.created_time,
          data_ora_osservazione: this.data.data_ora_osservazione,
          //diffusione_perc:"",
          identificazione:this.data.identificazione,
          latitudine: this.data.latitudine,
          loc_problema: this.data.loc_problema,
          localita: this.data.localita,
          longitudine: this.data.longitudine,
          modified_time: this.data.modified_time,
          nome_comune: this.data.nome_comune,
          //nome_scientifico:"",
          photo_0_imageurl: this.data.photo_0_imageurl,
          photo_1_imageurl: this.data.photo_1_imageurl,
          photo_2_imageurl: this.data.photo_2_imageurl,
          quota: this.data.quota,
          //sintomo_0:"",
          //sintomo_1:"",
          //sintomo_2:"",
          //specie:"",
          status: this.data.status,
          tipologia: this.data.tipologia,
          
        }]
      );
      /*
      const wm: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
        modelList.map((model)=>{
          return {
            name: model.name,
            specie: model.specie,
            h_model: model.h_model,
            v_model: model.v_model
          }
        }),
        {header:["name","specie","h_model","v_model"]});
      const wt: XLSX.WorkSheet = XLSX.utils.json_to_sheet(treeList,{header:["specie","d1","d2","h","v","lat","lng"]});
      */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      
      XLSX.utils.book_append_sheet(wb, ws, "Survey");
      //XLSX.utils.book_append_sheet(wb, wm, "Models");
      //XLSX.utils.book_append_sheet(wb, wt, "Tree List");
      XLSX.writeFile(wb, "silvacuore_survey.xlsx");
    });
  }
}