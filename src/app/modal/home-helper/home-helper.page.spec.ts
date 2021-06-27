import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomeHelperPage } from './home-helper.page';

describe('HomeHelperPage', () => {
  let component: HomeHelperPage;
  let fixture: ComponentFixture<HomeHelperPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeHelperPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeHelperPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
