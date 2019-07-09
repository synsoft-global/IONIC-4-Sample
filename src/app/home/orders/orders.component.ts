/*!
 * Order Component
 * @description this include all function of order component.
 * Get order list
 * @author   Ajay Mishra <ajaymishra@synsoftglobal.com> <https://synsoftglobal.com>
 * @license  MIT
 * @see https://github.com/synsoft-global/IONIC-4-Sample
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AuthService, LockerService, CommonService } from '../../shared/services/index';
import { Configuration } from '../../../app/app.constants';
import { _ } from 'underscore';
import { ArraySortOrderPipe } from '../../shared/pipe/common.pipe';
import { NetworkService } from '../../shared/services/network';
import { XlatPipe } from '../../shared/pipe/xlat.pipe';
import * as moment from 'moment';
import { CurrencyPipe } from '@angular/common';
import { IonInfiniteScroll } from '@ionic/angular';

/**
* @Component
* Define order component.
* Include order html template.
*/
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  providers: [ArraySortOrderPipe],
  styleUrls: ['./orders.component.scss']
})

export class OrdersComponent implements OnInit {
  currentSupplier: any;
  user: any;
  orders: any = [];
  public customer: any;
  suppliers: any;
  subscriptions: any[] = [];
  items: any;
  itemsToDisplay: any;
  public productData: any = {};
  index: number = 0;
  networkStatus: any;
  ordersResult: any;
  productResult: any;
  currentDate: any;
  startDate: any;
  endDate: any;
  date: any;
  public holidayList: any = [];
  public searchText: any = '';
  searchStart: any;
  totalSales: any = { total: 0, PriceAmount: 0, estPriceAfterTax: 0 };
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  /**
  * @constructor
  * @param  {CommonService} private_commonService
  * @param  {LockerService} private__lockerService 
  * @param  {AuthService} private__authService
  * @param  {AlertController} private_alertController
  * @param  {Network} private_network
  * @param  {XlatPipe} private_xlat
  * @param  {Configuration} private__config
  * @param  {ModalController} private_modalController
  */
  constructor(
    private modalController: ModalController,
    private _lockerService: LockerService,
    private _authService: AuthService,
    public alertController: AlertController,
    private _commonService: CommonService,
    public networkService: NetworkService,
    private _config: Configuration,
    private xlat: XlatPipe
  ) {
    this.currentDate = new Date();
    this.user = JSON.parse(this._lockerService.get('user'));
    /**
     * Subscribe tab change property.
     * @user private
     * @startDate private
     * @endDate private
     * @date private
     * @orders private
     * @networkService private
     * @_commonService private
     * @index private
     * @searchText private
     * @infiniteScroll private
     */
    this.subscriptions.push(_commonService.tabChanged$.subscribe(
      data => {
        this.user = JSON.parse(this._lockerService.get('user'));
        this.startDate = moment(new Date()).subtract(7, 'd').format('YYYY-MM-DD');
        this.endDate = moment(new Date()).format('YYYY-MM-DD');
        this.date = moment(new Date()).format('DD/MM/YYYY');
        if (data == 'orders' && !!this.user) {
          this.orders = [];
          this._commonService.showLoading(true);
          this.networkService.checkConnection();
          this.networkStatus = this._lockerService.get('connection_status');
          this.index = 0;
          this.searchText = '';
          this.loadSupplierCatalog();
          this.GetSalesRecords();
          if (!!this.infiniteScroll)
            this.infiniteScroll.disabled = false;
        } else {
          //this.deleteData();
        }
      })
    );


  }

  /**
   * Load More data on page scroll
   * @param event:object
   * @ordersResult private
   * @index private
   * */
  doInfinite(event) {
    this._commonService.showLoading(true);
    setTimeout(() => {
      this.checkSupplier(this.index);
      event.target.complete();
      if (this.ordersResult.page == this.ordersResult.pages || this.ordersResult.total == 0) {
        event.target.disabled = true;
      }
    }, 500);
  }


  ngOnInit() {


  }

  /**
   * Add extra html when datepicker open.
   */
  addemelemt() {
    setTimeout(() => {
      let elem: Element = document.getElementsByClassName("picker-toolbar")[0];
      if (elem)
        elem.insertAdjacentHTML('afterend', '<div class="picker-toolbar sc-ion-picker-md"> <ion-label class="sc-ion-picker-md picker-col picker-opts-center hydrated sc-ion-label-md-h sc-ion-label-md-s" style="text-align: right;display: block;right: 20px;">' + this.xlat.transform('DAY') + '</ion-label><ion-label style="max-width: 34px;" class="sc-ion-picker-md picker-col picker-opts-center hydrated sc-ion-label-md-h sc-ion-label-md-s">' + this.xlat.transform('MONTH') + '</ion-label> <ion-label class="sc-ion-picker-md picker-col picker-opts-center hydrated sc-ion-label-md-h sc-ion-label-md-s" style="text-align:left;display: block;left: 20px;">' + this.xlat.transform('YEAR') + '</ion-label></div>')
    }, 300);
  }

  /**
  * Increase index after added item in view list.
  * @index private
  * @itemsToDisplay private
  * */
  addItems() {
    this.index += 1;
    this.itemsToDisplay = this.orders;
  }

  /**
    * @applyFilter
    * Apply search Filter
    * @searchStart private
    * @index private
    * @orders private
    * @itemsToDisplay private
    * @infiniteScroll private
    * 
  */
  applyFilter() {
    let self = this;
    window.clearTimeout(this.searchStart);
    this.searchStart = window.setTimeout(function () {
      self.index = 0;
      self.orders = [];
      self.itemsToDisplay = [];
      if (!!self.infiniteScroll)
        self.infiniteScroll.disabled = false;
      self.checkSupplier();
    }, 1000);
  }

  /**
    * @GetSalesRecords
    * Get Total Sales record from suppiler account number.
    * @networkStatus private
    * @_authService private
    * @totalSales private
    * @_lockerService private
    * @user private
    *
  */
  GetSalesRecords() {
    this.networkStatus = this._lockerService.get('connection_status');
    let self = this;
    if (this.networkStatus == 0) {
      this._authService.getTotalSales(this.user.supplierAccountNum, this.user.internalId, this.startDate, this.endDate).subscribe(
        data => {
          self.totalSales = data;
          self._lockerService.set('totalSales', JSON.stringify(self.totalSales), this._config.TokenExpiryDays);
        },
        err => {

        }

      );
    } else {
      let totalSales = JSON.parse(this._lockerService.get('totalSales'));
      if (typeof totalSales !== "undefined" && !!totalSales) {
        self.totalSales = totalSales;

      }
    }
  }

  /**
     * @checkSupplier
     * Get Total Sales record from suppiler account number.
     * @param index:number
     * @networkStatus private
     * @_authService private
     * @totalSales private
     * @_lockerService private
     * @user private
     * @orders
     *
   */
  checkSupplier(index = 0) {
    if (index == 0) {
      this.orders = [];
      this.itemsToDisplay = [];
    }
    if (this.currentSupplier != undefined) {
      let supplier: any = {};
      let self = this;
      self._commonService.showLoading(true);
      supplier.email = this.currentSupplier.email.orders;
      supplier.supplierAccountNum = this.currentSupplier.supplierAccountNum;
      supplier.name = this.currentSupplier.name;
      this.networkStatus = this._lockerService.get('connection_status');

      if (!!this.user) {
        if (this.networkStatus == 0) {
          this._authService.getOrdersForSupplier(this.user.supplierAccountNum, this.searchText, index, this.user.internalId).subscribe(
            data => {
              if (data.page <= data.pages) {
                self.orders = [...self.orders, ...data.orders];
                self.addItems();
                self._commonService.showLoading(false);
                self._lockerService.set('orders', JSON.stringify(self.orders), this._config.TokenExpiryDays);

              }
              this.ordersResult = data;
            },
            err => {
              self._commonService.showLoading(false);
            }

          );
        } else {
          let orders_storage = JSON.parse(this._lockerService.get('orders'));
          if (typeof orders_storage !== "undefined" && !!orders_storage) {
            self.orders = orders_storage;
            self.itemsToDisplay = this.orders;
            self._commonService.showLoading(false);
          }
        }
      }
    } else {
      if (!!this.user) {
        this.loadSupplierCatalog();
      }
    }
  }

  /**
     * @ordersharelink
     * get order share link for whatsapp.
     * @param info:object
     * @param campaignId:number
     * @param randomid:string
     * @networkStatus private
     * @_authService private
     *
   */
  ordersharelink(info, campaignId = 0, randomid) {
    let self = this;
    let c = info.customer;
    let orderLink = this._config.BaseUrl + `orderinfo/${randomid}`;
    let suplaiPedidosPlayStore = this._config.SuplaiPedidosPlayStore;

    let text = this.xlat.transform('SHARE_ORDER_MESSAGE') + "";
    if (c.changePassword && c.changePassword.token) {
      text = text.replace("{0}", orderLink).replace('{1}', suplaiPedidosPlayStore).replace('{2}', c.username).split('{3}')[0];
    } else {
      text = text.replace("{0}", orderLink).replace('{1}', suplaiPedidosPlayStore).replace('{2}', c.username).replace('{3}', '').replace('{4}', c.password);
    }

    if (c.invitationCode) {
      let waInviteCode = this.xlat.transform('waInviteCode') + c.invitationCode;
      text += waInviteCode;
    }

    text = encodeURI(text);
    text = (text).replace("%25plus%25", "%2B");
    let country_code = info.customer.country + info.customer.phone;
    let link = "https://wa.me/" + country_code + "?text=" + text;
    this.openTab(link);
  }


  /**
   * @openTab
   * open new window tab when browser.
   * @param url:string  
   *
  */
  openTab(url) {
    // Create link in memory
    var a = window.document.createElement("a");
    a.target = '_blank';
    a.href = url;
    // Dispatch fake click
    var e = window.document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
  };



  /**
   * @loadSupplierCatalog
   * get suppiler catalog.
   * @_lockerService private
   * @_authService private
   * @user private
   * @suppliers private
   *
  */
  loadSupplierCatalog() {
    let self = this;
    let supplierCatalog = JSON.parse(this._lockerService.get('supplierCatalog'));
    if (supplierCatalog == "[]") {
      this._lockerService.set('supplierCatalog', '', this._config.TokenExpiryDays);
      this._lockerService.del('supplierCatalog');
    }
    /**
     * Check if user logged-in.
     */
    if (!!self.user) {
      if (this.networkStatus == 0) {
        self._authService.getSupplierCatalogV2({ country: self.user.country, city: self.user.city, accountNum: self.user.accountNum, supplierAccountNum: self.user.supplierAccountNum }).subscribe(
          res => {
            self._lockerService.set('supplierCatalog', JSON.stringify(res.supplierCatalog), this._config.TokenExpiryDays);
            self.suppliers = JSON.parse(this._lockerService.get('supplierCatalog'));
            self.currentSupplier = _.findWhere(res.supplierCatalog, { supplierAccountNum: self.user.supplierAccountNum });
            self._lockerService.set('currentSupplier', JSON.stringify(self.currentSupplier), this._config.TokenExpiryDays);
            self.checkSupplier();
          },
          err => {
            self._lockerService.del('supplierCatalog');
          }
        );
      } else {
        this.suppliers = supplierCatalog;
        this.currentSupplier = _.findWhere(this.suppliers, { supplierAccountNum: this.user.supplierAccountNum });
        if (this.currentSupplier != undefined) {
          self.checkSupplier();
        }
      }
    }

  };


  /**
  * @updateOrder
  * get suppiler catalog.
  * @param newStatus:string
  * @param newComments:string
  * @param order:object
  * @_lockerService private
  * @_commonService private
  * @user private
  * @suppliers private
  *
  */
  updateOrder = function (newStatus, newComments, order) {
    this.networkStatus = this._lockerService.get('connection_status');
    let self = this;
    self._commonService.showLoading(true);
    order.supplierConf = {
      viewed: true,
      confirmed: newStatus,
      comments: newComments
    };


    let orderDetails = { supplier: [{ supplierConf: order.supplierConf }] };
    if (this.networkStatus == 0) {
      this._authService.updateOrder({ orderId: encodeURIComponent(order.orderId), orderDetails: orderDetails }).subscribe(
        res => {
          self.showSuccess('UPDATE_SUCCESS');
          order.supplierConf.commentOpen = false;
          self._commonService.showLoading(false);
        },
        err => {
          if (err.error && err.error == 'Order not found') {
            this.showError('ORDER_NOT_FOUND');
          } else {
            self.showSuccess('ERROR_ORDER_UPDATE');
            self._commonService.showLoading(false);
          }
        }
      );
    } else {
      /**
       * If user not online then push order in local storage.
       */
      let queue_post = JSON.parse(this._lockerService.get('queue_post'));
      if (!queue_post) {
        queue_post = [];
      }
      queue_post.push({ 'url': 'api/v1/updateOrder/', 'method': 'put', 'data': { orderId: encodeURIComponent(order.orderId), orderDetails: orderDetails } });
      self.showSuccess('OFFLINE_ORDER_MSG');
      this._lockerService.set('queue_post', JSON.stringify(queue_post), this._config.TokenExpiryDays);
      self._commonService.showLoading(false);
    }
  };

  /**
  * @getSupplierLink
  * get suppiler link data from customer object.
  * @param customer:object
  * @param supplierAccountNum:string
  * @return Link:object
  *
  */
  getSupplierLink(customer, supplierAccountNum) {
    let customerLink = customer.supplierLink;
    let Link = {
      supplierAccountNum: supplierAccountNum,
      listPriceId: '',
      supplierGivenId: '',
      salesPerson: {
        id: '',
        fullName: ''
      }
    };
    if (customerLink) {
      Link = {
        supplierAccountNum: supplierAccountNum,
        listPriceId: customerLink.listPriceId,
        supplierGivenId: customerLink.supplierGivenId,
        salesPerson: {
          id: (!!customerLink.salesPerson ? customerLink.salesPerson.id : ''),
          fullName: (!!customerLink.salesPerson ? customerLink.salesPerson.fullName : '')
        }
      };
    }


    return Link;
  };


  /**
  * @updateStandByStatus
  * update stand by order status
  * @param reason:string
  * @param order:string
  * @_lockerService private
  * @_commonService private
  * @user private
  *
  */
  updateStandByStatus = function (reason, order) {
    let data = {
      reason: reason,
      order: order,
      user: this.user,
      timestamp: new Date()
    };
    this.subscriptions.push(this._authService.updateStandByStatus({ data: data }).subscribe(
      postedData => {
        this.showSuccess('SUCCESS_TITLE');
      }, err => {
        this.showError('SOMETHING_WENT_WRONG_WITH_API');
      }))
  };

  /**
  * Show Success alert
  * @param  {String} message
  * @alertController public
  * @xlat private
  * */
  async showSuccess(message) {
    const alert = await this.alertController.create({
      header: this.xlat.transform('SUCCESS_TITLE'),
      message: this.xlat.transform(message),
      buttons: [this.xlat.transform('OK_TITLE')]
    });
    await alert.present();

  }


  /**
  * Show error alert
  * @param  {String} message
  * @alertController public
  * @xlat private
  * */
  async showError(message) {
    const alert = await this.alertController.create({
      header: this.xlat.transform('ERROR_TITLE'),
      message: this.xlat.transform(message),
      buttons: [this.xlat.transform('OK_TITLE')]
    });
    await alert.present();
  }

  deleteData() {
    console.log('ngOnDestroy');
    delete this.currentSupplier;
    delete this.user;
    delete this.orders;
    delete this.customer;
    delete this.suppliers;
    delete this.subscriptions;
    delete this.items;
    delete this.itemsToDisplay;
    delete this.productData;
    delete this.index;
    delete this.networkStatus;
    // reasonsdata: any;
    delete this.ordersResult;
    delete this.productResult;
    delete this.currentDate;
    //listPrice: any = [];
    delete this.startDate;
    delete this.endDate;
    delete this.date;
  }

  /**
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
  */
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
