import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LockerService } from '../locker';

@Injectable()
export class CommonService {
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

  showLoading(value) {
    this.loadingPropertyChanged.next(value)
  }

  /**
  *  Subscribe login change
  *
  */

  showLogin(value) {
    this.loginPropertyChanged.next(value)
  }

  /**
  *  Subscribe Tab Change 
  *   
  */
  showTabChange(value) {
    this.tabChanged.next(value)
  }

  /**
  *  Subscribe Network stsus change
  *
  */
  showNetworkChange(value) {
    this.networkPropertyChanged.next(value)
  }
  /**
  *  Logout current user.
  *
  */

  clearLogoutHistory() {
    this._lockerService.del('customers');
    this._lockerService.del('products');
    this._lockerService.del('supplierCatalog');
    this._lockerService.del('currentSupplier');
  }

  /**
  *  Logout current user.
  *
  */

  logout() {
    this._lockerService.del('demo_token');
    this._lockerService.del('customers');
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
