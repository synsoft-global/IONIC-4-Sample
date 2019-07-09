import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { translation } from './i18n';
import { LockerService } from '../services/locker';

@Pipe({
  name: 'xlat'
})

@Injectable()
export class XlatPipe implements PipeTransform {
  language: any = 'es';
  language_default: any = 'es';
  constructor(private _lockerService: LockerService) {
    if (!!this._lockerService.get('language')) {
      this.language = this._lockerService.get('language');
    }
  }

  transform(value: any, args?: any): any {
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
