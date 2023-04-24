import { TestBed } from '@angular/core/testing';

import { NumeroLetrasService } from './numero-letras.service';

describe('NumeroLetrasService', () => {
  let service: NumeroLetrasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NumeroLetrasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
