import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SurveysManagerPage } from './surveys-manager.page';

describe('SurveysManagerPage', () => {
  let component: SurveysManagerPage;
  let fixture: ComponentFixture<SurveysManagerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveysManagerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SurveysManagerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
