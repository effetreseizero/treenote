import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewSurveyHelperPageRoutingModule } from './new-survey-helper-routing.module';

import { NewSurveyHelperPage } from './new-survey-helper.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewSurveyHelperPageRoutingModule
  ],
  declarations: [NewSurveyHelperPage]
})
export class NewSurveyHelperPageModule {}
