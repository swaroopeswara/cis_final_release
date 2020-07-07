import { TestBed, inject } from '@angular/core/testing';

import { RestcallService } from './restcall.service';

describe('RestcallService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RestcallService]
    });
  });

  it('should be created', inject([RestcallService], (service: RestcallService) => {
    expect(service).toBeTruthy();
  }));
});
