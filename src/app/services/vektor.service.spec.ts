import { TestBed } from '@angular/core/testing';

import { VektorService } from './vektor.service';

describe('VektorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VektorService = TestBed.get(VektorService);
    expect(service).toBeTruthy();
  });
});
