import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoordsEditPage } from './coords-edit.page';

const routes: Routes = [
  {
    path: '',
    component: CoordsEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoordsEditPageRoutingModule {}
