import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeHelperPageRoutingModule } from './home-helper-routing.module';

import { HomeHelperPage } from './home-helper.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeHelperPageRoutingModule
  ],
  declarations: [HomeHelperPage]
})
export class HomeHelperPageModule {}
