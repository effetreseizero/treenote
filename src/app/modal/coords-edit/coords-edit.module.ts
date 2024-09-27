import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';

import { IonicModule } from '@ionic/angular';

import { CoordsEditPageRoutingModule } from './coords-edit-routing.module';

import { CoordsEditPage } from './coords-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoordsEditPageRoutingModule
  ],
  declarations: [CoordsEditPage]
})
export class CoordsEditPageModule {}
