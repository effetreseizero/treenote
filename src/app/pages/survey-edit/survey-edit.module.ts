import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SurveyEditPageRoutingModule } from './survey-edit-routing.module';

import { SurveyEditPage } from './survey-edit.page';

import { MapModule } from '../../map.module';



@NgModule({
  imports: [
    //AppModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SurveyEditPageRoutingModule,
    MapModule
  ],
  declarations: [
    SurveyEditPage,
    
  ]
})
export class SurveyEditPageModule {}
