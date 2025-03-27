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
      let export_data = {
        localita: this.data.localita,
        data_ora_osservazione: this.data.data_ora_osservazione,
        status: this.data.status,

        tipologia: this.data.tipologia,
        identificazione:this.data.identificazione,
        nome_comune: this.data.nome_comune,
        loc_problema: this.data.loc_problema,
        commenti: this.data.commenti,

        specie:this.data.specie,
        nome_scientifico:this.data.nome_scientifico,
        sintomo_0:this.data.sintomo_0,
        sintomo_1:this.data.sintomo_1,
        sintomo_2:this.data.sintomo_2,
        diffusione_perc:this.data.diffusione_perc,
        alberi_morti: this.data.alberi_morti,
        
        photo_0_imageurl: this.data.photo_0_imageurl,
        photo_1_imageurl: this.data.photo_1_imageurl,
        photo_2_imageurl: this.data.photo_2_imageurl,
        
        created_time: new Date(this.data.created_time).toLocaleString(),
        modified_time: new Date(this.data.modified_time).toLocaleString(),
        
        latitudine: this.data.latitudine,
        longitudine: this.data.longitudine,
        quota: this.data.quota,         
        accuratezza: this.data.accuratezza,
        
      }


      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
        [export_data]
      );

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      
      XLSX.utils.book_append_sheet(wb, ws, "Survey");

      XLSX.writeFile(wb, "silvacuore_survey.xlsx");
    });
  }

  exportSurveyListToExcel(surveyList) {
    debugger;

    surveyList = surveyList.map(s=>{
      return {
        id:s.id,
        user_email:s.user_email,
        localita:s.localita,
        data_osservazione: new Date(s.data_ora_osservazione).toLocaleDateString(),
        ora_osservazione: new Date(s.data_ora_osservazione).toLocaleTimeString(),
        status:s.status,
        tipologia:s.tipologia,
        identificazione:s.identificazione,
        nome_comune:s.nome_comune,
        loc_problema:s.loc_problema,
        commenti:s.commenti,
        avanzate:s.avanzate,
        specie:s.specie,
        nome_scientifico:s.nome_scientifico,
        sintomo_0:s.sintomo_0,
        sintomo_1:s.sintomo_1,
        sintomo_2:s.sintomo_2,
        diffusione_perc:s.diffusione_perc,
        alberi_morti:s.alberi_morti,
        photo_0_imageurl:s.photo_0_imageurl,
        photo_1_imageurl:s.photo_1_imageurl,
        photo_2_imageurl:s.photo_2_imageurl,
        latitudine:s.latitudine,
        longitudine:s.longitudine,
        quota:s.quota,
        accuratezza:s.accuratezza,
        user_uid:s.user_uid,
        data_ora_osservazione:s.data_ora_osservazione,
        created_time:new Date(s.created_time).toLocaleString(),
        modified_time:new Date(s.modified_time).toLocaleString()
      }
    }
    )

    
    let fields = [
      "id","user_email","localita","data_osservazione","ora_osservazione","status",
      "tipologia","identificazione","nome_comune","loc_problema","commenti",
      "avanzate","specie","nome_scientifico","sintomo_0","sintomo_1","sintomo_2","diffusione_perc","alberi_morti",
      "photo_0_imageurl","photo_1_imageurl","photo_2_imageurl",
      "latitudine","longitudine","quota","accuratezza",
      "user_uid","data_ora_osservazione","created_time","modified_time",
    ];
    
    
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      surveyList,{header: fields}
    );

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    
    XLSX.utils.book_append_sheet(wb, ws, "Survey");

    XLSX.writeFile(wb, "silvacuore_survey.xlsx");
  }
}