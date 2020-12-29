import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SurveyEditPageRoutingModule } from './survey-edit-routing.module';

import { SurveyEditPage } from './survey-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SurveyEditPageRoutingModule
  ],
  declarations: [SurveyEditPage]
})
export class SurveyEditPageModule {}
