import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

//import { MenuPageRoutingModule } from './menu-routing.module';
//https://www.positronx.io/add-dynamic-side-menu-in-ionic-with-active-class/
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';


const routes: Routes = [
  {
    path: 'menu',
    component: MenuPage,
    children: [
      {
        path: 'contact',
        loadChildren: '../contact/contact.module#ContactPageModule'
      },
      {
        path: 'export',
        loadChildren: '../export/export.module#ExportPageModule'
      },
      {
        path: 'home',
        loadChildren: '../home/home.module#HomePageModule'
      },
    ]
  },
  {
    path: '',
    redirectTo: '/menu/home'
  }
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
