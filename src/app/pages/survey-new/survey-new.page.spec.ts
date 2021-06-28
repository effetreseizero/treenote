import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SurveyNewPage } from './survey-new.page';

describe('SurveyNewPage', () => {
  let component: SurveyNewPage;
  let fixture: ComponentFixture<SurveyNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyNewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
