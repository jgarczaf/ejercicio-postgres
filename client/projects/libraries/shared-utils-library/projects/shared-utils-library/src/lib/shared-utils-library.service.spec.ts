import { TestBed } from '@angular/core/testing';

import { SharedUtilsLibraryService } from './shared-utils-library.service';

describe('SharedUtilsLibraryService', () => {
  let service: SharedUtilsLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedUtilsLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
