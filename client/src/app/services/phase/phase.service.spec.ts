import {TestBed} from '@angular/core/testing';

import {PhaseService} from './phase.service';

describe('PhaseService', () => {
  let service: PhaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
