import { NgModule } from '@angular/core';

import {OlMapComponentSurvey} from './components/ol-map-survey/ol-map-survey.component';


@NgModule({
    declarations: [
        OlMapComponentSurvey
    ],
    exports: [
        OlMapComponentSurvey
    ],
    imports: [
 
    ],
    providers: [
        OlMapComponentSurvey,
    ],
})
export class MapModule {}
