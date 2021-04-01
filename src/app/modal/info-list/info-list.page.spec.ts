import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfoListPage } from './info-list.page';

describe('InfoListPage', () => {
  let component: InfoListPage;
  let fixture: ComponentFixture<InfoListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InfoListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
