/*!
 * Translation pipe
 * @description this file include all translation services.
 * @author   Ajay Mishra <ajaymishra@synsoftglobal.com> <https://synsoftglobal.com>
 * @license  MIT
 * @see https://github.com/synsoft-global/IONIC-4-Sample
 */
import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { translation } from './i18n';
import { LockerService } from '../services/locker';


/**
* @Pipe
* create injectable translation pipe.
*/
@Pipe({
  name: 'xlat'
})

@Injectable()
export class XlatPipe implements PipeTransform {
  language: any = 'es';
  language_default: any = 'es';
  /**
  * @constructor
  * @param  {LockerService} private__lockerService
  */
  constructor(private _lockerService: LockerService) {
    if (!!this._lockerService.get('language')) {
      this.language = this._lockerService.get('language');
    }
  }

  /**
     * @transform
     * @param value:string
     *  @_lockerService private
     *  @language private
     *  @return translation:string
     */
  transform(value: any): string {
    if (!!this._lockerService.get('language')) {
      this.language = this._lockerService.get('language');
    }
    if (!!translation[this.language]) {
      return translation[this.language][value];
    } else {
      return translation[this.language_default][value];
    }
  }

}
