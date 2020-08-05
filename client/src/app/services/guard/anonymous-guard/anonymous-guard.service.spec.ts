import {TestBed} from '@angular/core/testing';

import {AnonymousGuardService} from './anonymous-guard.service';

describe('AnonymousGuardService', () => {
  let service: AnonymousGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnonymousGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
