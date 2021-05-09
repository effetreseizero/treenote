import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OlMapComponentSurvey } from './ol-map-survey.component';

describe('OlMapComponent', () => {
  let component: OlMapComponentSurvey;
  let fixture: ComponentFixture<OlMapComponentSurvey>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlMapComponentSurvey ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OlMapComponentSurvey);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
