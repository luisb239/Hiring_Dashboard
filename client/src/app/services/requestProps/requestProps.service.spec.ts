import { TestBed } from '@angular/core/testing';

import { RequestPropsService } from './requestProps.service';

describe('RequestPropertiesService', () => {
  let service: RequestPropsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestPropsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
