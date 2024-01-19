import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { logInGaurdGuard } from './log-in-gaurd.guard';

describe('logInGaurdGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => logInGaurdGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
