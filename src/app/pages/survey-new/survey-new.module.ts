import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SurveyNewPageRoutingModule } from './survey-new-routing.module';

import { SurveyNewPage } from './survey-new.page';


import { MapModule } from '../../map.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SurveyNewPageRoutingModule,
    MapModule
  ],
  declarations: [
    SurveyNewPage,
    //OlMapComponentSurvey
  ]
})
export class SurveyNewPageModule {}
