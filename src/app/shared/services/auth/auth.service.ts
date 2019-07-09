/*!
 * this file include all auth services.
 * @description this sfile include app component feature. Check user and netwrok status.
 * @author   Ajay Mishra <ajaymishra@synsoftglobal.com> <https://synsoftglobal.com>
 * @license  MIT
 * @see https://github.com/synsoft-global/IONIC-4-Sample
 */
import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, Subject, throwError } from 'rxjs';
import { CommonService } from '../common/index';
import { Configuration } from 'src/app/app.constants';
import { LockerService } from '../locker/index';
import { Cloudinary } from '@cloudinary/angular-5.x';

@Injectable()
export class AuthService {
  private actionUrl: string;
  private httpOptions: {};
  Isloggin: boolean;

  constructor(
    private http: Http,
    private _config: Configuration,
    private _commonService: CommonService,
    private _lockerService: LockerService,
    private cloudinary: Cloudinary
  ) {
    this.actionUrl = _config.ServerAPIUrl;
    this.handleError = this.handleError.bind(this);
  }

  init() {
    this.httpOptions = {
      'headers': new Headers({
        'Authorization': 'Bearer ' + this._lockerService.get('demo_token')
      })
    };
  }

  /**
   * @IsLoggedIn
   * get User By email
   * @param data:string
   * @_commonService private
   * @return respose:boolean
   * @Isloggin private
   * @actionUrl private
   **/
  IsLoggedIn() {
    if ((!this._lockerService.get('demo_token') || this._lockerService.get('demo_token') == 'undefined' || this._lockerService.get('demo_token') == 'myToken')) {
      this.Isloggin = false;
    }
    else {
      this.Isloggin = true;
    }
    return this.Isloggin;

  }

  /**
   * @GetLoginInfo
   * login request.
   * @param data:object
   * @return response:object
   * @_commonService private
   * @http private
   * @actionUrl private
   **/

  GetLoginInfo(data) {
    this._commonService.showLoading(true);
    return this.http.post(this.actionUrl + 'apploginjwt', data)
      .pipe(map((response: Response) => { this.onSuccess(); return response.json() }))
      .pipe(catchError(this.handleError));
  }

  /**
  * @changePasswordCheck
  * get User By email
  * @param data:string
  * @_commonService private
  * @http private
  * @actionUrl private
  **/
  changePasswordCheck(data) {
    return this.http.post(this.actionUrl + 'api/v1/changePasswordCheck/', data, this.httpOptions)
      .pipe(map((response: Response) => { this.onSuccess(); return response.json() }))
      .pipe(catchError(this.handleError));
  }

  /**
  * @getUserByEmail
  * get User By email
  * @param data:string
  * @return data:json
  * @_commonService private
  * @http private
  * @actionUrl private
  **/
  getUserByEmail(data) {
    this._commonService.showLoading(true);
    return this.http.get(this.actionUrl + 'api/v1/getUserByEmail/' + data)
      .pipe(map((response: Response) => { this.onSuccess(); return response.json() }))
      .pipe(catchError(this.handleError));
  }

  /**
  * @getSupplierCatalogV2
  * get suppiler catalog from suppiler account number.
  * @param data:object
  * @_commonService private
  * @return data:JSON
  * @http private
  * @actionUrl private
  **/
  getSupplierCatalogV2(data) {
    this.init();
    return this.http.get(this.actionUrl + 'api/v2/getSupplierCatalog/' + data.country + '/' + data.city + '/' + data.accountNum + '/' + data.supplierAccountNum, this.httpOptions)
      .pipe(map((response: Response) => { return response.json() }))
      .pipe(catchError(this.handleError));
  }

  /**
   * @processOrder
   * post queue order data to server.
   * @param data:string
   * @_lockerService private
   * @http private
   * @return processqueue:boolean
   * @actionUrl private
   **/
  processOrder() {
    this.init();
    let processqueue = false;
    let queue_post = JSON.parse(this._lockerService.get('queue_post'));
    if (queue_post) {
      for (let i = 0; i < queue_post.length; i++) {
        let query = queue_post[i];
        if (query.method == 'post') {
          this.http.post(this.actionUrl + query.url, query.data, this.httpOptions)
            .pipe(map((response: Response) => { this.onSuccess(); return response.json() }))
            .pipe(catchError(this.handleError)).subscribe();
        } else if (query.method == 'put') {
          this.http.put(this.actionUrl + query.url, query.data, this.httpOptions)
            .pipe(map((response: Response) => { this.onSuccess(); return response.json() }))
            .pipe(catchError(this.handleError)).subscribe();
        }
        processqueue = true;
      }
    }
    this._lockerService.set('queue_post', '[]', this._config.TokenExpiryDays);
    this._lockerService.del('queue_post');
    return processqueue;
  }

  /**
  * @getTotalSales
  * get total sales date.
  * @param supplierAccountNum:string
  * @param startDate:Date
  * @param endDate:Date
  * @param internalId:string
  *  @return response:JSON
  * @_commonService private
  * @http private
  * @actionUrl private
  **/
  getTotalSales(supplierAccountNum, internalId, startDate, endDate) {
    this.init();

    return this.http.get(this.actionUrl + 'api/v2/getTotalSales/' + supplierAccountNum + '/' + '?salesPersonId=' + internalId + '&startDate=' + startDate + '&endDate=' + endDate, this.httpOptions)
      .pipe(map((response: Response) => { return response.json() }))
      .pipe(catchError(this.handleError));
  }

  /**
  * @getOrdersForSupplier
  * get orders list.
  * @param supplierAccountNum:string
  * @param searchText:string
  * @param index:number
  * @param internalId:string
  * @_commonService private
  * @http private
  * @actionUrl private
  **/
  getOrdersForSupplier(supplierAccountNum, searchText, index, internalId) {
    this.init();
    this._commonService.showLoading(true);
    return this.http.get(this.actionUrl + 'api/v2/getOrdersForSupplier/' + supplierAccountNum + '/' + index + '?salesPersonId=' + internalId + '&search=' + searchText, this.httpOptions)
      .pipe(map((response: Response) => { this.onSuccess(); return response.json() }))
      .pipe(catchError(this.handleError));
  }

  /**
  * @getReasons
  * get reason data.
  * @param data:string
  * @_commonService private
  * @http private
  * @actionUrl private
  **/
  getReasons(data) {
    this.init();
    this._commonService.showLoading(true);
    return this.http.get(this.actionUrl + 'api/v1/getReasons/' + data, this.httpOptions)
      .pipe(map((response: Response) => { this.onSuccess(); return response.json() }))
      .pipe(catchError(this.handleError));
  }

  /**
  * @handleError
  * Handle error response in api and return error JOSN.
  * @param error:object
  * @return error:json
  * @_commonService private
  **/
  private handleError(error: any) {
    this._commonService.showLoading(false);
    return throwError(error.json());
  }

  /**
   * @onSuccess
   * hide loading screen after get api response.
   * @_commonService private
   **/
  private onSuccess() {
    this._commonService.showLoading(false);
  }

}
