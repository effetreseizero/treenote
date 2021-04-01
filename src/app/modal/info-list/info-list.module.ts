import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfoListPageRoutingModule } from './info-list-routing.module';

import { InfoListPage } from './info-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfoListPageRoutingModule
  ],
  declarations: [InfoListPage]
})
export class InfoListPageModule {}
