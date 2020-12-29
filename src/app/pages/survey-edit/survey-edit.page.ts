import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, RouteReuseStrategy } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { FirebaseService} from '../../services/data/firestore.service';
import { Survey} from '../../services/data/survey';

@Component({
  selector: 'app-survey-edit',
  templateUrl: './survey-edit.page.html',
  styleUrls: ['./survey-edit.page.scss'],
})
export class SurveyEditPage implements OnInit {

  public surveyId = null;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private firebaseService:FirebaseService
  ) {
    //https://ionicacademy.com/pass-data-angular-router-ionic-4/
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.surveyId = this.router.getCurrentNavigation().extras.state.id;
      }
    });
  }

  ngOnInit() {
    
  }

}
