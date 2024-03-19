import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SurveyEditPageRoutingModule } from './survey-edit-routing.module';

import { SurveyEditPage } from './survey-edit.page';

//https://medium.com/runic-software/a-simple-guide-to-openlayers-in-angular-b10f6feb3df1
import {OlMapComponentSurvey} from '../../components/ol-map-survey/ol-map-survey.component';

//import { AppModule } from 'src/app/app.module';



@NgModule({
  imports: [
    //AppModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SurveyEditPageRoutingModule,
  ],
  declarations: [
    SurveyEditPage,
    
  ]
})
export class SurveyEditPageModule {}
