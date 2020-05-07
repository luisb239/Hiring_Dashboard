import { TestBed } from '@angular/core/testing';

import { RequestService } from './request.service';

describe('ServerService', () => {
  let service: RequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
