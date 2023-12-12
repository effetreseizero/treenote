import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  //https://www.positronx.io/add-dynamic-side-menu-in-ionic-with-active-class/
  {
    path: '',
    loadChildren: './menu/menu.module#MenuPageModule'
  },
  {
    path: 'info-list',
    loadChildren: () => import('./modal/info-list/info-list.module').then( m => m.InfoListPageModule)
  },
  {
    path: 'home-helper',
    loadChildren: () => import('./modal/home-helper/home-helper.module').then( m => m.HomeHelperPageModule)
  },
  {
    path: 'survey-new',
    loadChildren: () => import('./pages/survey-new/survey-new.module').then( m => m.SurveyNewPageModule)
  },
  {
    path: 'new-survey-helper',
    loadChildren: () => import('./modal/new-survey-helper/new-survey-helper.module').then( m => m.NewSurveyHelperPageModule)
  },  {
    path: 'coords-edit',
    loadChildren: () => import('./modal/coords-edit/coords-edit.module').then( m => m.CoordsEditPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
