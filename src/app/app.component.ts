import { Component, NgZone } from '@angular/core';

import { Platform, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CommonService, LockerService, AuthService } from './shared/services/index';
import { Router, NavigationEnd } from '@angular/router';
import { Configuration } from './app.constants';
import { AlertController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { XlatPipe } from './shared/pipe/xlat.pipe';
import { Globalization } from '@ionic-native/globalization/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

export class AppComponent {

  subscriptions: any[] = [];
  isLoading: boolean = false;
  Isloggin: boolean = false;
  loadingScreen: any;
  connection_status: boolean;
  networkOnlineSubscription: any;
  networkOfflineSubscription: any;
  ONLINE_TEXT: any = this.xlat.transform('ONLINE');
  OFFLINE_TEXT: any = this.xlat.transform('OFFLINE');
  LOGOUT_TEXT: any = this.xlat.transform('LOGOUT');

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private _commonService: CommonService,
    private _router: Router,
    private _lockerService: LockerService,
    public loadingController: LoadingController,
    private _authService: AuthService,
    public alertController: AlertController,
    private network: Network,
    private globalization: Globalization,
    private xlat: XlatPipe,
    private _config: Configuration,
    private ngZone: NgZone
  ) {



    /**
     *  Initilize app function
     * Check User Login property changed.
     */
    this.initializeApp();
    this.subscriptions.push(_commonService.loadingPropertyChanged$.subscribe(
      data => {
        if (data)
          this.presentLoading();
        else
          this.closeLoading();
      })
    );

    this.subscriptions.push(_commonService.networkPropertyChanged$.subscribe(
      data => {
        if (data)
          this.processOrder();
      })
    );
    let self = this;


    if (this.platform.is('cordova')) {


      this.platform.ready().then(() => {

        if (this.network.type == 'none') {
          self._lockerService.set('connection_status', 1, self._config.TokenExpiryDays);
          self.connection_status = false;
          self.showOfflineMsg('OFFLINE_MSG');

        } else {
          self.connection_status = true;
          self._lockerService.set('connection_status', 0, self._config.TokenExpiryDays);

        }

        this.networkOnlineSubscription = this.network.onConnect().subscribe(() => {
          self._lockerService.set('connection_status', 0, self._config.TokenExpiryDays);
          self.connection_status = true;
          self._commonService.showNetworkChange(true);

        });
        this.networkOfflineSubscription = this.network.onDisconnect().subscribe(() => {
          self._lockerService.set('connection_status', 1, self._config.TokenExpiryDays);
          self.showOfflineMsg('OFFLINE_MSG');
          self.connection_status = false;
          self._commonService.showNetworkChange(false);

        });

      });

      let language = this._lockerService.get('language');
      if (!language && navigator.language) {
        let str = navigator.language.split("-");
        self._lockerService.set('language', str[0], this._config.TokenExpiryDays);
        this.setDefaultText();
      }

    } else {
      window.addEventListener('online', () => {
        self._lockerService.set('connection_status', 0, self._config.TokenExpiryDays);
        self.connection_status = true;
        self._commonService.showNetworkChange(true);

      });

      window.addEventListener('offline', () => {
        self._lockerService.set('connection_status', 1, self._config.TokenExpiryDays);
        self.showOfflineMsg('OFFLINE_MSG');
        self.connection_status = false;
        self._commonService.showNetworkChange(false);
      });
      if (navigator.onLine) {
        self._lockerService.set('connection_status', 0, self._config.TokenExpiryDays);
        self.connection_status = true;
        self._commonService.showNetworkChange(true);
      } else {
        self._lockerService.set('connection_status', 1, self._config.TokenExpiryDays);
        self.showOfflineMsg('OFFLINE_MSG');
        self.connection_status = false;
        self._commonService.showNetworkChange(false);
      }
      let language = this._lockerService.get('language');
      if (!language && (window.navigator.languages && window.navigator.languages[1])) {
        this._lockerService.set('language', window.navigator.languages[1], this._config.TokenExpiryDays);
        this.setDefaultText();
      }
    }



  }


  /**
   *  Process Order when user online.
   * 
   */

  processOrder() {
    let status = this._lockerService.get('connection_status');
    if (status == 0) {
      let processqueue = this._authService.processOrder();
      if (processqueue) {
        this._commonService.showTabChange('orders');
        this.showSuccess('QUEUE_PROCESSED');
      }
    }
  }

  /**
  *  Logout User
  *
  */

  logout() {
    this.Isloggin = false;
    this._commonService.showLogin(false);
    this._commonService.showLoading(true);
    this._router.navigate(['/']);
    this._commonService.logout();
    this.setDefaultText();
    this._commonService.showLoading(false);
  }

  /**
  *  Init function
  *
  */



  ngOnInit() {
    let self = this;
    this.processOrder();
    this.subscriptions.push(this._router.events.subscribe((evt) => {

      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      else if ((!this._lockerService.get('demo_token') || this._lockerService.get('demo_token') == 'undefined' || this._lockerService.get('demo_token') == 'myToken') && evt.url.indexOf('reset-password') == -1) {
        this._router.navigate(['/']);
        this.Isloggin = false;
      }
      else {
        if (evt.url == '/app/orders') {
          this._commonService.showTabChange('orders');
        } else if (evt.url == '/app/customers') {
          this._commonService.showTabChange('customers');
        } else if (evt.url == '/app/invoices') {
          this._commonService.showTabChange('invoices');
        } else if (evt.url == '/') {
          this._router.navigate(['/app/orders']);
          this._commonService.showTabChange('orders');
        }
        this.setDefaultText();
        this.Isloggin = true;
        this._commonService.showLogin(true);
      }

    }));

  }

  /**
  *  Set Default text.
  *
  */

  setDefaultText() {
    this.ONLINE_TEXT = this.xlat.transform('ONLINE');
    this.OFFLINE_TEXT = this.xlat.transform('OFFLINE');
    this.LOGOUT_TEXT = this.xlat.transform('LOGOUT');
  }

  async presentLoading() {
    this.isLoading = true;
  }

  async closeLoading() {
    this.ngZone.run(() => {
      this.isLoading = false;
    });
  }

  /**
  *  Show Offline Alert.
  *
  */

  async showOfflineMsg(message) {
    const alert = await this.alertController.create({
      header: '',
      message: this.xlat.transform(message),
      buttons: [this.xlat.transform('OK_TITLE')]
    });
    await alert.present();

  }

  /**
  *  Show Success Message.
  *
  */

  async showSuccess(message) {
    const alert = await this.alertController.create({
      header: this.xlat.transform('SUCCESS_TITLE'),
      message: this.xlat.transform(message),
      buttons: [this.xlat.transform('OK_TITLE')]
    });
    await alert.present();

  }

  /**
  *  Show Error Message.
  *
  */
  async showError(message) {
    const alert = await this.alertController.create({
      header: this.xlat.transform('ERROR_TITLE'),
      message: this.xlat.transform(message),
      buttons: [this.xlat.transform('OK_TITLE')]
    });
    await alert.present();
  }



  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

  }
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
