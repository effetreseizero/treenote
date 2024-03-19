import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './services/auth/auth.guard';

const routes: Routes = [
  //https://www.positronx.io/add-dynamic-side-menu-in-ionic-with-active-class/
  {
    path: '',
    redirectTo:'home',
    pathMatch:'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'contact',
    loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactPageModule)
  },
  {
    
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'registration',
    loadChildren: () => import('./pages/registration/registration.module').then(m => m.RegistrationPageModule)
  },
  {
    path: 'user-account',
    loadChildren: () => import('./pages/user-account/user-account.module').then( m => m.UserAccountPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'verify-email',
    loadChildren: () => import('./pages/verify-email/verify-email.module').then( m => m.VerifyEmailPageModule)
  },
  {
    path: 'surveys',
    loadChildren: () => import('./pages/surveys/surveys.module').then( m => m.SurveysPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'surveys-manager',
    loadChildren: () => import('./pages/surveys-manager/surveys-manager.module').then( m => m.SurveysManagerPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'survey-new',
    loadChildren: () => import('./pages/survey/survey.module').then( m => m.SurveyPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'survey-edit',
    loadChildren: () => import('./pages/survey-edit/survey-edit.module').then( m => m.SurveyEditPageModule),
    canActivate: [AuthGuard],
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
