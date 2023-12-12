import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CoordsEditPage } from './coords-edit.page';

describe('CoordsEditPage', () => {
  let component: CoordsEditPage;
  let fixture: ComponentFixture<CoordsEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoordsEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CoordsEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
