import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewSurveyHelperPage } from './new-survey-helper.page';

describe('NewSurveyHelperPage', () => {
  let component: NewSurveyHelperPage;
  let fixture: ComponentFixture<NewSurveyHelperPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSurveyHelperPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewSurveyHelperPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
