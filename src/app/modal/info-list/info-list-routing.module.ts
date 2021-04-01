import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfoListPage } from './info-list.page';

const routes: Routes = [
  {
    path: '',
    component: InfoListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfoListPageRoutingModule {}
