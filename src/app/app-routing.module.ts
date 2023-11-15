import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  //https://www.positronx.io/add-dynamic-side-menu-in-ionic-with-active-class/
  {
    path: '',
    redirectTo:'home',
    pathMatch:'full'
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
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
