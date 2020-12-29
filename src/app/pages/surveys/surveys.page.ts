import { Component, OnInit } from '@angular/core';

import { SurveysService} from '../../services/firestore/surveys.service';
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
    private surveysService: SurveysService,
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

    this.surveysService.read_surveys_collection().subscribe(data => {
      
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

  createSurvey() {
    console.log(this.surveyForm.value);
    this.surveysService.create_survey_document(this.surveyForm.value).then(resp => {
      this.surveyForm.reset(); 
    })
      .catch(error => {
        console.log(error);
      });
  }

  deleteSurvey(recordID) {
    this.surveysService.delete_surveys_document(recordID);
  }

  updateSurvey(record){
    //https://ionicacademy.com/pass-data-angular-router-ionic-4/
    let navigationExtras: NavigationExtras = {
      state: {
        id: record.id 
      }
    };
      this.router.navigate(['/menu/survey-edit'],navigationExtras);
  }

}
