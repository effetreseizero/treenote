import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewSurveyHelperPage } from './new-survey-helper.page';

const routes: Routes = [
  {
    path: '',
    component: NewSurveyHelperPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewSurveyHelperPageRoutingModule {}
