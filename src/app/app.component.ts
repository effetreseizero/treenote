import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar , Style} from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
 
  ) {
    this.initializeApp();
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
