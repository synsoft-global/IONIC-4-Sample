/*!
 * This file include test cases of locker service.
 *
 * @author   Ajay Mishra <ajaymishra@synsoftglobal.com> <https://synsoftglobal.com>
 * @license  MIT
 * @see https://github.com/synsoft-global/IONIC-4-Sample
 */
import { TestBed } from '@angular/core/testing';

import { LockerService } from './locker.service';

describe('LockerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LockerService = TestBed.get(LockerService);
    expect(service).toBeTruthy();
  });
});
