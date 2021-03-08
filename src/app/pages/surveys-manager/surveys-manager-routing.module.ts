import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SurveysManagerPage } from './surveys-manager.page';

const routes: Routes = [
  {
    path: '',
    component: SurveysManagerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SurveysManagerPageRoutingModule {}
