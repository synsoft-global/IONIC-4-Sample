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
  // reasonsdata: any;
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




  constructor(
    private modalController: ModalController,
    private _lockerService: LockerService,
    private _authService: AuthService,
    public alertController: AlertController,
    private _commonService: CommonService,
    private orderSort: ArraySortOrderPipe,
    public networkService: NetworkService,
    private _config: Configuration,
    private xlat: XlatPipe,
    private currencyPipe: CurrencyPipe) {
    this.currentDate = new Date();
    this.user = JSON.parse(this._lockerService.get('user'));
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
   *
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

  addemelemt() {
    setTimeout(() => {
      let elem: Element = document.getElementsByClassName("picker-toolbar")[0];
      if (elem)
        elem.insertAdjacentHTML('afterend', '<div class="picker-toolbar sc-ion-picker-md"> <ion-label class="sc-ion-picker-md picker-col picker-opts-center hydrated sc-ion-label-md-h sc-ion-label-md-s" style="text-align: right;display: block;right: 20px;">' + this.xlat.transform('DAY') + '</ion-label><ion-label style="max-width: 34px;" class="sc-ion-picker-md picker-col picker-opts-center hydrated sc-ion-label-md-h sc-ion-label-md-s">' + this.xlat.transform('MONTH') + '</ion-label> <ion-label class="sc-ion-picker-md picker-col picker-opts-center hydrated sc-ion-label-md-h sc-ion-label-md-s" style="text-align:left;display: block;left: 20px;">' + this.xlat.transform('YEAR') + '</ion-label></div>')
    }, 300);
  }

  addItems() {
    this.index += 1;
    this.itemsToDisplay = this.orders;
  }

  /**
  * Apply search Filter
  *
  * */
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
  * Get Total Sales record
  *
  * */
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
   * Check Suppiler
   *
   * */

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
   * Load Suppiler catalog on page load.
   *
   * */
  loadSupplierCatalog() {
    let self = this;
    let supplierCatalog = JSON.parse(this._lockerService.get('supplierCatalog'));
    if (supplierCatalog == "[]") {
      this._lockerService.set('supplierCatalog', '', this._config.TokenExpiryDays);
      this._lockerService.del('supplierCatalog');
    }

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

  //Sorry, but I can't deliver the order because:
  //I will deliver your order but I have the following observations:
  //Yes, I can fullfil the order
  addComment = function (comment, supplierConf) {
    supplierConf.commentOpen = true;
    return this.xlat.transform(comment);
  };

  /**
   * Update Order
   *
   * */
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
   * Delete Order
   *
   * */
  async presentDeleteOrder(o) {
    const alert = await this.alertController.create({
      header: this.xlat.transform('ASK_DELETE'),
      backdropDismiss: false,
      buttons: [
        {
          text: this.xlat.transform('OK'),
          handler: () => {
            this.removeorder(o);
          }
        },
        {
          text: this.xlat.transform('CANCEL')
        }
      ]
    });
    await alert.present();
  }


  /**
  * Remove Order
  *
  * */
  removeorder = function (o) {
    let self = this;
    this.subscriptions.push(this._authService.removeOrder({ data: o.order, supplierAccountNum: this.currentSupplier.supplierAccountNum }).subscribe(order => {
      this.showSuccess("DELETE");

      if (o) {
        let index = _.findIndex(self.orders, function (f) {
          return (f.order._id === o.order._id);
        });
        if (index >= 0) {
          self.orders.splice(index, 1);// ;
        }
      }
      this.GetSalesRecords();
      self._commonService.showLoading(false);
    }, err => {
      if (err.error && err.error == 'Edit not allowed') {
        self.showError('ORDER_ALREADY_PROCESSED');
        self.GetSalesRecords();
        self.checkSupplier();
      } else if (err.error && err.error == 'Order not found') {
        this.showError('ORDER_NOT_FOUND');
        self.checkSupplier();
      } else {
        self.showError('SOMETING_WENT_WRONG_WITH_API');
      }
      self._commonService.showLoading(false);
    }))
  }

  /**
  * Place Order
  *
  * */
  placeOrder = function (o) {
    try {

      this.customer = o.customer;
      let c = o.customer;
      let tomorrow = new Date();
      let deliveryDate = this._customerService.getDeliveryDateOrder(c.supplierLink, this.currentSupplier.supplierAccountNum, this.holidayList);
      let supplierLink = this.getSupplierLink(c, this.currentSupplier.supplierAccountNum);
      if (supplierLink && !!supplierLink.listPriceId) {
        this._commonService.showLoading(true);
        tomorrow.setDate(tomorrow.getDate() + 1);
        let Orderaccountnum = o.order._id;
        if (deliveryDate.deliveryDateStatus) {
          o.order.deliveryDate = deliveryDate.deliveryDate;
        }
        this.productData.cart = {
          accountNum: c.accountNum,
          clientName: c.clientName,
          email: c.email,
          orderDetails: {
            restaurantName: c.restaurantName,
            addressLine: c.addressLine,
            city: c.city,
            country: c.country,
            orderDate: o.order.orderDate,
            orderComments: o.order.orderComments,
            orderStatus: {
              date: o.order.orderDate,
              confirmed: true
            },
            supplier: [{
              supplierLink: supplierLink,
              orderConseq: c.orderConseq,
              minDate: tomorrow.getFullYear() + '-' + tomorrow.getMonth() + 1 + '-' + tomorrow.getDate(),
              deliveryDate: o.order.deliveryDate,
              deliveryDateStatus: deliveryDate.deliveryDateStatus,
              name: this.currentSupplier.name,
              supplierAccountNum: this.currentSupplier.supplierAccountNum,
              email: this.currentSupplier.email.orders,
              phone: this.currentSupplier.phone,
              _id: o.order.orderId,
              item: []
            }]
          }
        };

        let supplier_item = JSON.parse(JSON.stringify(o.order.item));
        let self = this;
        let products = JSON.parse(this._lockerService.get('suplai_ventas_products'));
        if (self.user) {
          this.networkStatus = this._lockerService.get('connection_status');
          if (this.networkStatus == 0) {
            let search = {
              searchPlace: '',
              searchCategory1: '',
              searchCategory2: '',
              searchListPrice: ''
            }
            if (supplierLink && supplierLink.listPriceId) {
              search.searchListPrice = supplierLink.listPriceId;
            }
            this._authService.ProductAll(c.accountNum, this.currentSupplier.supplierAccountNum, 0, search).subscribe(
              data => {
                this.productResult = data;
                let image_u = '';
                let image_f = '';
                let img: any;
                data.customerProducts = _.filter(data.products, function (prod) {
                  prod.qty = 0;
                  if (!!prod.picture) {
                    image_u = prod.picture;
                    image_f = prod.picture;
                    img = image_u.split("/image/upload/");
                    if (img.length > 1) {
                      image_f = img[0] + '/image/upload/w_50,c_scale/' + img[1];
                      prod.small_picture = image_f;
                    }
                  }

                  var foundIndex = self.productData.cart.orderDetails.supplier[0].item.findIndex(x => x.SellersItemIdentification == prod.SellersItemIdentification && x.listPriceId == prod.listPriceId);

                  if (foundIndex > -1) {
                    prod.qty = self.productData.cart.orderDetails.supplier[0].item[foundIndex].qty;
                  }


                  var foundIndex1 = supplier_item.findIndex(x => x.SellersItemIdentification == prod.SellersItemIdentification && x.listPriceId == prod.listPriceId);

                  if (foundIndex1 > -1) {
                    prod.qty = supplier_item[foundIndex1].qty;
                    if (self.IsBackReview == 'Yes') {
                      prod.original_qty = supplier_item[foundIndex1].qty;
                    }
                    else {
                      prod.original_qty = supplier_item[foundIndex1].original_qty;
                    }
                    prod.bonusqty = supplier_item[foundIndex1].bonusqty;
                  }

                  return true;
                });

                if (!products) {
                  products = {};
                }
                if (data.customerProducts && data.customerProducts.length > 0) {
                  products[c.accountNum] = data.customerProducts;
                  self._lockerService.set('suplai_ventas_products', JSON.stringify(products), this._config.TokenExpiryDays);
                  this.presentModal(data.customerProducts, this.productData, supplier_item, Orderaccountnum);
                  self._commonService.showLoading(false);
                } else {
                  this.showError('NO_ITEM_FOUND');
                  self._commonService.showLoading(false);
                }

              });
          } else {
            if (!!products && !!products[c.accountNum]) {
              this.presentModal(products[c.accountNum], this.productData, supplier_item, Orderaccountnum);
              self._commonService.showLoading(false);
            } else {
              this.showError('CURRENT_OFFLINE');
              self._commonService.showLoading(false);
            }

          }
        }
      } else {
        this.showError('NO_CUSTOMER_FOUND');
      }
    } catch (error) {
      console.log(error);
      this._commonService.showLoading(true);
    }

  };


  /**
  * Open edit cart model
  *
  * */
  async presentModal(customerProducts, productData, supplier_item, Orderaccountnum) {
    this._commonService.showLoading(true);
    const modal = await this.modalController.create({
      component: 'ModalPage',
      componentProps: {
        customerProducts: customerProducts,
        productData: productData,
        Orderaccountnum: Orderaccountnum,
        supplier_item: supplier_item,
        currentSupplier: this.currentSupplier,
        productResult: this.productResult,
        IsBackReview: 'Yes'
      },
      backdropDismiss: false,
      cssClass: 'modalAddProduct'
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data && !(data.cart.orderDetails.supplier == null)) {
      if (data.cart.orderDetails.supplier[0].item.length > 0) {
        this.reviewModal(data, Orderaccountnum);
      } else {
        const alert = await this.alertController.create({
          header: this.xlat.transform('ERROR_TITLE'),
          message: this.xlat.transform('NO_ITEM_IN_CART'),
          buttons: [this.xlat.transform('OK_TITLE')]
        });
        await alert.present();
      }
      this._commonService.showLoading(false);
    } else {
      this._commonService.showLoading(false);
    }

  }


  /**
  * Review Order
  *
  * */
  async reviewModal(data_, Orderaccountnum) {
    this._commonService.showLoading(true);
    const modal = await this.modalController.create({
      component: 'ReviewPage',
      componentProps: {
        data_: data_,
        customer: this.customer,
        supplierAccountNum: this.currentSupplier.supplierAccountNum, currentSupplier: this.currentSupplier,
        Orderaccountnum: Orderaccountnum,
        productResult: this.productResult,
        holidayList: this.holidayList
      },
      backdropDismiss: false,
      cssClass: 'modalAddProduct'
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.orders = [];
      this.checkSupplier();
      //   this.UpdateSalesvist()
    }
    this.productData = {};
  }


  /**
  * get suppiler link
  *
  * */
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
  * Update Product Status
  *
  * */
  updateStandByStatus = function (reason, order) {
    // let resons = JSON.parse(reason);
    // order.order.standBy = resons;
    // console.log(resons);
    let data = {
      reason: reason,
      order: order,
      user: this.user,
      timestamp: new Date()
    };
    console.log(data);
    this.subscriptions.push(this._authService.updateStandByStatus({ data: data }).subscribe(
      postedData => {
        this.showSuccess('SUCCESS_TITLE');
      }, err => {
        this.showError('SOMETHING_WENT_WRONG_WITH_API');
      }))
  };




  /**
  * Show Success alert
  *
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
  *
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

  ngOnDestroy() {
    console.log('ngOnDestroy');
    //this.deleteData();
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
