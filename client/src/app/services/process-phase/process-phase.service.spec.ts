import { TestBed } from '@angular/core/testing';

import { ProcessPhaseService } from './process-phase.service';

describe('ProcessPhaseService', () => {
  let service: ProcessPhaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessPhaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
