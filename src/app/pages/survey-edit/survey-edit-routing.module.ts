import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SurveyEditPage } from './survey-edit.page';

//https://stackoverflow.com/questions/58651389/router-guards-in-angular-8
import { CanDeactivateGuard } from '../../services/deactivate/deactivate.guard';


const routes: Routes = [
  {
    path: '',
    component: SurveyEditPage,
    canDeactivate: [CanDeactivateGuard]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CanDeactivateGuard],
})
export class SurveyEditPageRoutingModule {}
