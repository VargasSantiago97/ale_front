import { TestBed } from '@angular/core/testing';

import { CpeService } from './cpe.service';

describe('CpeService', () => {
  let service: CpeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CpeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
