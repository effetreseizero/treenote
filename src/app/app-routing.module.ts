import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  //https://www.positronx.io/add-dynamic-side-menu-in-ionic-with-active-class/
  {
    path: '',
    loadChildren: './menu/menu.module#MenuPageModule'
  },
  {
    path: 'surveys',
    loadChildren: () => import('./pages/surveys/surveys.module').then( m => m.SurveysPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
