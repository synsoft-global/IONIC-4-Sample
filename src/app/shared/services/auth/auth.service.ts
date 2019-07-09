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
  constructor(private http: Http, private _config: Configuration, private _commonService: CommonService, private _lockerService: LockerService, private cloudinary: Cloudinary) {
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
  *  Check If user logged in
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
  *  Set routes for Login and Order app page.
  *
  */

  GetLoginInfo(data) {
    this._commonService.showLoading(true);
    return this.http.post(this.actionUrl + 'apploginjwt', data)
      .pipe(map((response: Response) => { this.onSuccess(); return response.json() }))
      .pipe(catchError(this.handleError));
  }

  /**
  *  get user id
  **/

  getUserById(encodedId) {
    this._commonService.showLoading(true);
    return this.http.get(this.actionUrl + 'api/v1/getUserById/' + encodedId)
      .pipe(map((response: Response) => { this.onSuccess(); return response.json() }))
      .pipe(catchError(this.handleError));
  }

  /**
  *  Check for change password
  **/

  changePasswordCheck(data) {
    return this.http.post(this.actionUrl + 'api/v1/changePasswordCheck/', data, this.httpOptions)
      .pipe(map((response: Response) => { this.onSuccess(); return response.json() }))
      .pipe(catchError(this.handleError));
  }

  /**
  *  get User By email
  **/
  getUserByEmail(data) {
    this._commonService.showLoading(true);
    return this.http.get(this.actionUrl + 'api/v1/getUserByEmail/' + data)
      .pipe(map((response: Response) => { this.onSuccess(); return response.json() }))
      .pipe(catchError(this.handleError));
  }

  getUserByUsername(data) {
    this._commonService.showLoading(true);
    return this.http.get(this.actionUrl + 'api/v1/getUserByUsername/' + data.username + '/' + data.supplierAccountNum)
      .pipe(map((response: Response) => { this.onSuccess(); return response.json() }))
      .pipe(catchError(this.handleError));
  }

  changePasswordMail(data) {
    this._commonService.showLoading(true);
    return this.http.put(this.actionUrl + 'api/v1/changePasswordMail', data)
      .pipe(map((response: Response) => { this.onSuccess(); return response.json() }))
      .pipe(catchError(this.handleError));
  }

  /**
  *  Update user without login
  **/

  updateuserWithoutLogin(data) {
    return this.http.put(this.actionUrl + 'api/v1/updateuser', data, this.httpOptions)
      .pipe(map((response: Response) => { this.onSuccess(); return response.json() }))
      .pipe(catchError(this.handleError));
  }


  getObjectID() {
    this.init();
    this._commonService.showLoading(true);
    return this.http.get(this.actionUrl + 'api/v1/objectID/', this.httpOptions)
      .pipe(map((response: Response) => { this.onSuccess(); return response.json() }))
      .pipe(catchError(this.handleError));
  }

  Updateuser(data) {
    this.init();
    this._commonService.showLoading(true);
    return this.http.put(this.actionUrl + 'api/v1/updateuser', data, this.httpOptions)
      .pipe(map((response: Response) => { this.onSuccess(); return response.json() }))
      .pipe(catchError(this.handleError));
  }

  /**
  *  get suppiler catalog
  **/
  getSupplierCatalogV2(data) {
    this.init();
    return this.http.get(this.actionUrl + 'api/v2/getSupplierCatalog/' + data.country + '/' + data.city + '/' + data.accountNum + '/' + data.supplierAccountNum, this.httpOptions)
      .pipe(map((response: Response) => { return response.json() }))
      .pipe(catchError(this.handleError));
  }



  updateuserPhone(data) {
    this.init();
    this._commonService.showLoading(true);
    return this.http.put(this.actionUrl + 'api/v1/updatePhone', { data: data }, this.httpOptions)
      .pipe(map((response: Response) => { this.onSuccess(); return response.json() }))
      .pipe(catchError(this.handleError));
  }

  /**
  *  Get customer cellphone
  **/
  getCustomerCellPhone(supplierAccountNum, accountNum) {
    this.init();
    this._commonService.showLoading(true);
    return this.http.get(this.actionUrl + 'api/v1/getCustomerCellphone/' + supplierAccountNum + '/' + accountNum, this.httpOptions)
      .pipe(map((response: Response) => { this.onSuccess(); return response.json() }))
      .pipe(catchError(this.handleError));
  }

  /**
   * get random campaign
   **/
  getRandomCampaign(startDate, supplierAccountNum, accountNum) {
    this.init();
    return this.http.get(this.actionUrl + 'api/v1/getRandomCampaign/' + supplierAccountNum + '?fromdate=' + startDate + '&accountNum=' + accountNum, this.httpOptions)
      .pipe(map((response: Response) => { return response.json() }))
      .pipe(catchError(this.handleError));
  }

  /**
    * get current suppiler detail
    *
    * */

  getSupplierDetails(accountNum) {
    this.init();
    this._commonService.showLoading(true);
    return this.http.get(this.actionUrl + 'api/v1/getSupplierDetails/' + accountNum, this.httpOptions)
      .pipe(map((response: Response) => { this.onSuccess(); return response.json() }))
      .pipe(catchError(this.handleError));
  }

  /**
    * Process order after network online.
    *
    * */

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
  * Get total sales
  *
  * */
  getTotalSales(supplierAccountNum, internalId, startDate, endDate) {
    this.init();

    return this.http.get(this.actionUrl + 'api/v2/getTotalSales/' + supplierAccountNum + '/' + '?salesPersonId=' + internalId + '&startDate=' + startDate + '&endDate=' + endDate, this.httpOptions)
      .pipe(map((response: Response) => { return response.json() }))
      .pipe(catchError(this.handleError));
  }

  /**
  *Get Order from suppiler
  *
  * */
  getOrdersForSupplier(supplierAccountNum, searchText, index, internalId) {
    this.init();
    this._commonService.showLoading(true);
    return this.http.get(this.actionUrl + 'api/v2/getOrdersForSupplier/' + supplierAccountNum + '/' + index + '?salesPersonId=' + internalId + '&search=' + searchText, this.httpOptions)
      .pipe(map((response: Response) => { this.onSuccess(); return response.json() }))
      .pipe(catchError(this.handleError));
  }

  /**
  * Get order reasons status
  *
  * */
  getReasons(data) {
    this.init();
    this._commonService.showLoading(true);
    return this.http.get(this.actionUrl + 'api/v1/getReasons/' + data, this.httpOptions)
      .pipe(map((response: Response) => { this.onSuccess(); return response.json() }))
      .pipe(catchError(this.handleError));
  }

  /**
  * Update order
  *
  * */
  updateOrder(data) {
    this.init();
    this._commonService.showLoading(true);
    return this.http.put(this.actionUrl + 'api/v1/updateOrder/' + data.orderId, { orderDetails: data.orderDetails }, this.httpOptions)
      .pipe(map((response: Response) => { this.onSuccess(); return response.json() }))
      .pipe(catchError(this.handleError));
  }


  private handleError(error: any) {
    this._commonService.showLoading(false);
    return throwError(error.json());
  }

  private onSuccess() {
    this._commonService.showLoading(false);
  }

}
