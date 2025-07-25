import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar , Style} from '@capacitor/status-bar';

import {CoreFacade} from "./services/storage/core.facade"
import {User} from 'src/app/services/storage/user';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  activeIndex = 0;
  activePageTitle = 'Home';
  pages = [
    {
      name: 'Home',
      path: '/home',
      icon: 'home'
    },
    {
      name: 'Segnalazioni',
      path: '/surveys',
      icon: 'albums'
    },
    {
      name: 'Manuale',
      path: '/guide',
      icon: 'book'
    },{
      name: 'Informazioni',
      path: '/contact',
      icon: 'mail'
    }
    
  ];

  user: User;

  constructor(
    private platform: Platform,
    private coreFacade: CoreFacade

  ) {
    this.initializeApp();
    this.coreFacade.getUser().subscribe((user)=>{
      this.user=user;
      if(this.user==undefined){
        this.pages = this.pages.filter((page)=>{
          return page.name !="Manager";
        });
      }
      else if(this.user.isAdmin){
        this.pages.push({
          name: 'Manager',
          path: '/surveys-manager',
          icon: 'settings'
        });
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      const setStatusBarStyleDark = async () => {
        await StatusBar.setStyle({ style: Style.Dark });
      };
      
      const setStatusBarStyleLight = async () => {
        await StatusBar.setStyle({ style: Style.Light });
      };
      
      const hideStatusBar = async () => {
        await StatusBar.hide();
      };
      
      const showStatusBar = async () => {
        await StatusBar.show();
      };
      
      SplashScreen.hide();
    });
  }
}
