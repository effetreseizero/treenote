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
  private treeList = null;

  treeForm: FormGroup;


  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    public fb: FormBuilder,
    private surveysService:SurveysService
  ) {

    this.treeForm = this.fb.group({
      specie: ['', [Validators.required]],
      d1: ['', [Validators.required]],
      d2: ['', [Validators.required]]
    })

    

  }

  ngOnInit() {
    
    //https://ionicacademy.com/pass-data-angular-router-ionic-4/
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {

        this.surveyId = this.router.getCurrentNavigation().extras.state.id;

        this.survey = this.surveysService.read_suveys_document(this.surveyId).subscribe((data)=>{
          this.survey=data.payload.data();

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

            console.log("treeList: ");
            console.log(this.treeList);
      
          });

        });
        
      }
    });

  }

  createTree() {
    console.log(this.treeForm.value);
    this.surveysService.create_tree_document(this.surveyId,this.treeForm.value).then(resp => {
      this.treeForm.reset();
    })
      .catch(error => {
        console.log(error);
      });
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
