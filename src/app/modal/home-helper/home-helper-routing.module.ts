import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeHelperPage } from './home-helper.page';

const routes: Routes = [
  {
    path: '',
    component: HomeHelperPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeHelperPageRoutingModule {}
