import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SurveysManagerPageRoutingModule } from './surveys-manager-routing.module';

import { SurveysManagerPage } from './surveys-manager.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SurveysManagerPageRoutingModule
  ],
  declarations: [SurveysManagerPage]
})
export class SurveysManagerPageModule {}
