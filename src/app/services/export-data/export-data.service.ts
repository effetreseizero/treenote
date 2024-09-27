//https://bobcares.com/blog/export-data-into-excel-in-ionic-application-using-xlsx/

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportDataService {

  constructor() { }

  async exportSurveyToExcel(data) {
    {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
        [{
          accuratezza: 1,
          alberi_morti:"",
          avanzate:false,
          commenti:"",
          created_time:1727442264671,
          data_ora_osservazione:"2024-09-27T13:02:34.724Z",
          deleted:false,
          diffusione_perc:"",
          identificazione:"020_latifoglia",
          latitudine:46.31097505201535,
          loc_problema:"020_fusto",
          localita:"test trento review",
          longitudine:11.179353790020244,
          modified_time:1727442303238,
          nome_comune:"abete rosso",
          nome_scientifico:"",
          photo_0_imageurl:"https://firebasestorage.googleapis.com/v0/b/treenotepad.appspot.com/o/users_photo%2FASbl8a1FzLg8eN3lWfuKs1iKdJB2%2FtyDtxpVWo41KhP6Dv5tO%2F0.jpeg?alt=media&token=b5767a0e-2b52-4506-8fe6-294d4068bd82",
          photo_0_storageuri:"users_photo/ASbl8a1FzLg8eN3lWfuKs1iKdJB2/tyDtxpVWo41KhP6Dv5tO/0.jpeg",
          photo_1_imageurl:"",
          photo_1_storageuri:"",
          photo_2_imageurl:"",
          photo_2_storageuri:"",
          quota:0,
          sintomo_0:"",
          sintomo_1:"",
          sintomo_2:"",
          specie:"",
          status:"archive",
          tipologia:"010_gruppo",
          user_email:"giacomo.colle@gmail.com",
          user_uid:"ASbl8a1FzLg8eN3lWfuKs1iKdJB2",
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
    }
  }
}