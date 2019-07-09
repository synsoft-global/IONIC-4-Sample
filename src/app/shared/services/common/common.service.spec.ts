/*!
 * This file include test cases of common service provider.
 *
 * @author   Ajay Mishra <ajaymishra@synsoftglobal.com> <https://synsoftglobal.com>
 * @license  MIT
 * @see https://github.com/synsoft-global/IONIC-4-Sample
 */
import { TestBed, inject } from '@angular/core/testing';

import { CommonService } from './common.service';

describe('CommonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommonService]
    });
  });

  it('should be created', inject([CommonService], (service: CommonService) => {
    expect(service).toBeTruthy();
  }));
});
