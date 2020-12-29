import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, RouteReuseStrategy } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { SurveysService} from '../../services/firestore/surveys.service';
import { Survey} from '../../services/firestore/survey';

@Component({
  selector: 'app-survey-edit',
  templateUrl: './survey-edit.page.html',
  styleUrls: ['./survey-edit.page.scss'],
})
export class SurveyEditPage implements OnInit {

  private surveyId = null;
  private survey=null;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private surveysService:SurveysService
  ) {
    //https://ionicacademy.com/pass-data-angular-router-ionic-4/
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.surveyId = this.router.getCurrentNavigation().extras.state.id;
        this.survey = this.surveysService.read_document(this.surveyId).subscribe((data)=>{
          this.survey=data.payload.data();
        });
        
      }
    });
  }

  ngOnInit() {
    
    
  }

}
