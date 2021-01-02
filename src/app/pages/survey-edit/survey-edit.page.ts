//https://www.freakyjolly.com/ionic-firebase-crud-operations/#.X-2m2On0mEJ

//https://www.joshmorony.com/advanced-forms-validation-in-ionic-2/



import { Component, OnInit,ViewChild } from '@angular/core';

import { Router, ActivatedRoute, RouteReuseStrategy } from '@angular/router';
import { NavController } from '@ionic/angular';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { SurveysService} from '../../services/firestore/surveys.service';
import { Survey} from '../../services/firestore/survey';

import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-survey-edit',
  templateUrl: './survey-edit.page.html',
  styleUrls: ['./survey-edit.page.scss'],
})
export class SurveyEditPage implements OnInit {

  private surveyId = null;
  private survey=null;
  private treeList = null;

  public surveyForm: FormGroup;
  public submitAttempt: boolean = false;

  @ViewChild('surveySlider') surveySlider;


  constructor(
    private activatedRoute:ActivatedRoute,
    private navController: NavController,
    private router:Router,
    public formBuilder: FormBuilder,
    private surveysService:SurveysService,
    private alertController:AlertController
  ) {

    this.surveyForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      location: ['', ],
      notes: ['', ]
    });    

  }

  ngOnInit() {
    
    //https://ionicacademy.com/pass-data-angular-router-ionic-4/
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {

        this.surveyId = this.router.getCurrentNavigation().extras.state.id;

        //read survey data

        this.surveysService.read_surveys_document(this.surveyId).subscribe((data)=>{
          this.survey=data.payload.data();
          //https://angular.io/guide/deprecations#ngmodel-with-reactive-forms
          //https://ultimatecourses.com/blog/angular-2-form-controls-patch-value-set-value
          this.surveyForm.patchValue(this.survey);
        });

        //read survey trees data
        this.surveysService.read_trees_subcollection(this.surveyId).subscribe(data => {
    
          this.treeList = data.map(e => {
            return {
              id: e.payload.doc.id,
              isEdit: false,
              d1: e.payload.doc.data()['d1'],
              d2: e.payload.doc.data()['d2'],
              number: e.payload.doc.data()['number'],
              specie: e.payload.doc.data()['specie']
            };
          });
      
        });

      }
    });

  }

  saveSurvey() {
    this.submitAttempt = true;

    if(!this.surveyForm.valid){
        this.surveySlider.slideTo(0);
    } 
    else{
      this.surveysService.update_surveys_document(this.surveyId, this.surveyForm.value);
      this.navController.back();
    }
  }

  async addTree()
  {
    const alert = await this.alertController.create({
      header: 'Crea',
      inputs: [
        {name: 'specie',type: 'text',placeholder: 'Specie'},
        {name: 'd1',type: 'number',placeholder: 'D1'},
        {name: 'd2',type: 'number',placeholder: 'D2'}
      ],
      buttons: [
        {text: 'Cancel',role: 'cancel',cssClass: 'secondary',handler: () => {console.log('Confirm Cancel');}
        },
        {
          text: 'Ok',
          handler: (data) => {
            if (data.specie.length>0 && data.d1>0 && data.d2>0) {
              this.surveysService.create_tree_document(this.surveyId,data).then(resp => {
              })
              .catch(error => {
                console.log(error);
              });
            }
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }

  deleteTree(treeID) {
    this.surveysService.delete_tree_document(this.surveyId,treeID);
  }

 
  editTree(record) {
    record.isEdit = true;
    record.editSpecie = record.specie;
    record.editD1= record.d1;
    record.editD2 = record.d2;
  }

  updateTree(item) {
    let record = {};
    record['specie'] = item.editSpecie;
    record['d1'] = item.editD1;
    record['d2'] = item.editD2;
    this.surveysService.update_tree_document(this.surveyId,item.id, record);
    item.isEdit = false;
  }


}
