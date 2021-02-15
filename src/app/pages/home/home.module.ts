import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
//https://www.positronx.io/ionic-form-validation-tutorial/

import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';

//https://medium.com/runic-software/a-simple-guide-to-openlayers-in-angular-b10f6feb3df1
import {OlMapComponent} from '../../components/ol-map/ol-map.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [
    HomePage,
    OlMapComponent
  ]
})
export class HomePageModule {}
