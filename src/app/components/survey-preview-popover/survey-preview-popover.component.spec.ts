import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SurveyPreviewPopoverComponent } from './survey-preview-popover.component';

describe('SurveyPreviewPopoverComponent', () => {
  let component: SurveyPreviewPopoverComponent;
  let fixture: ComponentFixture<SurveyPreviewPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyPreviewPopoverComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyPreviewPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
