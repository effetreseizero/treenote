import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SurveyPageRoutingModule } from './survey-routing.module';

import { SurveyPage } from './survey.page';

import { MapModule } from '../../map.module';

import { CoordsEditPageModule} from '../../modal/coords-edit/coords-edit.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SurveyPageRoutingModule,
    MapModule,
    CoordsEditPageModule
  ],
  declarations: [
    SurveyPage,
    
  ]
})
export class SurveyPageModule {}
