import { TestBed } from '@angular/core/testing';

import { MatrixService } from './matrix.service';

describe('MatrixService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MatrixService = TestBed.get(MatrixService);
    expect(service).toBeTruthy();
  });

  it('should convert chars to index', () => {
    const service: MatrixService = TestBed.get(MatrixService);
    expect(service.charsToIndex([0, 1, 1, 2])).toBe(14);
  });
});
