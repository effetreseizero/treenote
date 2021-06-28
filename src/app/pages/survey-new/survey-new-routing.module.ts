import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SurveyNewPage } from './survey-new.page';

//https://stackoverflow.com/questions/58651389/router-guards-in-angular-8
import { CanDeactivateGuard } from '../../services/deactivate/deactivate.guard';


const routes: Routes = [
  {
    path: '',
    component: SurveyNewPage,
    canDeactivate: [CanDeactivateGuard]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CanDeactivateGuard],
})
export class SurveyNewPageRoutingModule {}
