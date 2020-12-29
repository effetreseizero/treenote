import { Component, OnInit } from '@angular/core';

import { FirebaseService} from '../../services/data/firestore.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { Router, NavigationExtras } from "@angular/router";

@Component({
  selector: 'app-surveys',
  templateUrl: './surveys.page.html',
  styleUrls: ['./surveys.page.scss'],
})
export class SurveysPage implements OnInit {

  surveyList = [];
  
  surveyForm: FormGroup;

  constructor(
    private firebaseService: FirebaseService,
    public fb: FormBuilder,
    private router: Router
  )
  {
   
  }

  ngOnInit()
  {
    this.surveyForm = this.fb.group({
      name: ['', [Validators.required]],
      location: ['', [Validators.required]],
      notes: ['', [Validators.required]]
    })

    this.firebaseService.read_surveys().subscribe(data => {
      
      this.surveyList = data.map(e => {
        return {
          id: e.payload.doc.id,
          isEdit: false,
          name: e.payload.doc.data()['name'],
          location: e.payload.doc.data()['location'],
          notes: e.payload.doc.data()['notes'],

        };
      });
      console.log("surveyList: ");
      console.log(this.surveyList);

    });
  }

  createRecord() {
    console.log(this.surveyForm.value);
    this.firebaseService.create_survey(this.surveyForm.value).then(resp => {
      this.surveyForm.reset();
    })
      .catch(error => {
        console.log(error);
      });
  }

  RemoveRecord(rowID) {
    this.firebaseService.delete_survey(rowID);
  }

  EditSurvey(record){
    //https://ionicacademy.com/pass-data-angular-router-ionic-4/
    let navigationExtras: NavigationExtras = {
      state: {
        id: record.id 
      }
    };
      this.router.navigate(['/menu/survey-edit'],navigationExtras);
  }
  /* moved to survey-edit
  EditRecord(record) {
    record.isEdit = true;
    record.editName = record.name;
    record.editLocation= record.location;
    record.editNotes = record.notes;
  }

  UpdateRecord(recordRow) {
    let record = {};
    record['name'] = recordRow.editName;
    record['location'] = recordRow.editLocation;
    record['notes'] = recordRow.editNotes;
    this.firebaseService.update_survey(recordRow.id, record);
    recordRow.isEdit = false;
  }
  */

}
