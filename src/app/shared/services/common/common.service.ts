/*!
 * The server module from node.js, for the browser.
 *
 * @author   Ajay Mishra <ajaymishra@synsoftglobal.com> <https://synsoftglobal.com>
 * @license  MIT
 * @see https://github.com/synsoft-global/IONIC-4-Sample
 */
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LockerService } from '../locker';

@Injectable()
export class CommonService {
  /**
   * @constructor
   * @param  {LockerService} private__lockerService
   */
  constructor(private _lockerService: LockerService) {

  }
  private loadingPropertyChanged = new Subject<boolean>();
  private loginPropertyChanged = new Subject<boolean>();
  private tabChanged = new Subject<string>();
  private networkPropertyChanged = new Subject<boolean>();

  loadingPropertyChanged$: Observable<boolean> = this.loadingPropertyChanged.asObservable();
  tabChanged$: Observable<string> = this.tabChanged.asObservable();
  loginPropertyChanged$: Observable<boolean> = this.loginPropertyChanged.asObservable();
  networkPropertyChanged$: Observable<boolean> = this.networkPropertyChanged.asObservable();

  /**
  * Show loading screen.
  * @param value:boolean
  * @loadingPropertyChanged privarte
  */
  showLoading(value) {
    this.loadingPropertyChanged.next(value)
  }

  /**
  * Subscribe login change
  * @param value:boolean
  * @loginPropertyChanged privarte
  */
  showLogin(value) {
    this.loginPropertyChanged.next(value)
  }

  /**
  * Subscribe Tab Change 
  * @param value: String
  * @tabChanged private
  */
  showTabChange(value) {
    this.tabChanged.next(value)
  }

  /**
  *  Subscribe Network stsus change
  * @param value:boolean
  * @networkPropertyChanged private
  */
  showNetworkChange(value) {
    this.networkPropertyChanged.next(value)
  }

  /**
  * Logout current user.
  * @_lockerService private
  */
  clearLogoutHistory() {
    this._lockerService.del('customers');
    this._lockerService.del('products');
    this._lockerService.del('supplierCatalog');
    this._lockerService.del('currentSupplier');
  }

  /**
  * @logout function
  * logout current user and clear all local storage
  * @_lockerService private
  */
  logout() {
    this._lockerService.del('demo_token');
    this._lockerService.del('products');
    this._lockerService.del('supplierCatalog');
    this._lockerService.del('url');
    this._lockerService.del('user');
    this._lockerService.del('currentSupplier');
    this._lockerService.del('queue_post');
    this._lockerService.del('orders');
    this._lockerService.del('language');
  }
}
