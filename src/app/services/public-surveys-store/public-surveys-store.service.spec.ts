import { TestBed } from '@angular/core/testing';

import { PublicSurveysStore } from './public-surveys-store.service';

describe('PublicSurveysService', () => {
  let service: PublicSurveysStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicSurveysStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
