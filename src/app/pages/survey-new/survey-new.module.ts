import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SurveyNewPageRoutingModule } from './survey-new-routing.module';

import { SurveyNewPage } from './survey-new.page';

//https://medium.com/runic-software/a-simple-guide-to-openlayers-in-angular-b10f6feb3df1
import {OlMapComponentSurvey} from '../../components/ol-map-survey/ol-map-survey.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SurveyNewPageRoutingModule
  ],
  declarations: [
    SurveyNewPage,
    OlMapComponentSurvey
  ]
})
export class SurveyNewPageModule {}
