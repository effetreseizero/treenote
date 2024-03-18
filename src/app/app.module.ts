import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//https://www.techiediaries.com/angular-local-json-files/
import { HttpClientModule } from '@angular/common/http';


// https://jsmobiledev.com/article/crud-ionic-firestore
import { firebaseConfig } from './credentials';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

//https://dev.to/saviosantos0808/real-time-localization-using-ionic-framework-and-google-spreadsheets-35pe
import { Geolocation } from '@ionic-native/geolocation/ngx';

//https://medium.com/runic-software/a-simple-guide-to-openlayers-in-angular-b10f6feb3df1
import {HelperPopoverComponent} from './components/helper-popover/helper-popover.component'
import {OlMapComponent} from './components/ol-map/ol-map.component';
import {OlMapComponentSurvey} from './components/ol-map-survey/ol-map-survey.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SurveyHelperPopoverComponent } from './components/survey-helper-popover/survey-helper-popover.component';
import { SurveyPreviewPopoverComponent } from './components/survey-preview-popover/survey-preview-popover.component';



@NgModule({
    declarations: [
        AppComponent,
        SurveyHelperPopoverComponent,
        HelperPopoverComponent,
        SurveyPreviewPopoverComponent,
        OlMapComponentSurvey
    ],
    exports: [
        OlMapComponentSurvey
    ],
    imports: [
        FormsModule,
        BrowserModule,
        IonicModule.forRoot({
            mode: 'md'
        }),
        AppRoutingModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,
        AngularFirestoreModule,
        AngularFirestoreModule.enablePersistence(),
        AngularFireAuthModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        HttpClientModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        Geolocation,
        OlMapComponent,
        OlMapComponentSurvey
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
