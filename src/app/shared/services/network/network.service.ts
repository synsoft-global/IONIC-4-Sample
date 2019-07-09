/*!
 * This file inclide network related services. *
 * @author   Ajay Mishra <ajaymishra@synsoftglobal.com> <https://synsoftglobal.com>
 * @license  MIT
 * @see https://github.com/synsoft-global/IONIC-4-Sample
 */
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Platform } from '@ionic/angular';
import { Configuration } from 'src/app/app.constants';
import { LockerService } from '../locker/index';
import { CommonService } from '../common/index';
import {
  Observable,
  fromEvent,
  merge,
  of
} from 'rxjs';

import {
  mapTo
} from 'rxjs/operators';

export enum ConnectionStatus {
  Online,
  Offline
}

@Injectable()

export class NetworkService {


  private status: any;
  networkOnlineSubscription: any;
  networkOfflineSubscription: any;
  constructor(
    private network: Network,
    private platform: Platform,
    private _lockerService: LockerService,
    private _commonService: CommonService,
    private _config: Configuration
  ) {

  }

  getConnection() {
    return this._lockerService.get('connection_status');
  }

  /**
  *  Check Network status and update inside app.
  * @platform private
  * @networkOnlineSubscription private
  * @network private
  * @_lockerService private
  * @_commonService private
  */
  checkConnection() {
    let self = this;
    if (this.platform.is('cordova')) {
      /**
       * Check if platform is cordova.
       * Check and subscribe network status.
       */
      this.platform.ready().then(() => {
        this.networkOnlineSubscription = this.network.onConnect().subscribe(() => {
          self._lockerService.set('connection_status', 0, this._config.TokenExpiryDays);
          self._commonService.showNetworkChange(true);
        });
        this.networkOfflineSubscription = this.network.onDisconnect().subscribe(() => {
          self._lockerService.set('connection_status', 1, this._config.TokenExpiryDays);
          self._commonService.showNetworkChange(false);
        });
      });
    } else {
      /**
     * Check if platform is browser.
     * Check and subscribe network status.
     */
      if (navigator.onLine) {
        self._lockerService.set('connection_status', 0, this._config.TokenExpiryDays);
        self._commonService.showNetworkChange(true);
      } else {
        self._lockerService.set('connection_status', 1, this._config.TokenExpiryDays);
        self._commonService.showNetworkChange(false);
      }
    }
  }
}

