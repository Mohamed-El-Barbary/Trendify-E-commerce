import { TestBed } from '@angular/core/testing';

import { NavColorService } from './nav-color.service';

describe('NavColorService', () => {
  let service: NavColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavColorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
