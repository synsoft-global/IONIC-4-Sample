/*!
 * App Component
 * @description this file include app component feature. Check user and netwrok status.
 * Handle redirection of match url.
 * @author   Ajay Mishra <ajaymishra@synsoftglobal.com> <https://synsoftglobal.com>
 * @license  MIT
 * @see https://github.com/synsoft-global/IONIC-4-Sample
 */
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

/**
* @Component
* Define app component.
* Include app html template.
*/
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

/**
* @Component
* Export app component.
*/

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

  /**
  * @constructor
  * @param  {Platform} private_platform
  * @param  {SplashScreen} private_splashScreen
  * @param  {StatusBar} private_statusBar
  * @param  {CommonService} private_commonService
  * @param  {Router} private_router
  * @param  {LockerService} private__lockerService
  * @param  {LoadingController} private_loadingController
  * @param  {AuthService} private__authService
  * @param  {AlertController} private_alertController
  * @param  {Network} private_network
  * @param  {XlatPipe} private_xlat
  * @param  {Configuration} private__config
  * @param  {NgZone} private_ngZone
  */
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
    private xlat: XlatPipe,
    private _config: Configuration,
    private ngZone: NgZone
  ) {


    /**   
     * Check User Login property.
     * Subscribe network change property.
     *  @loadingPropertyChanged public
     *  @presentLoading function
     *  @closeLoading function
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
      /*
      * check if platform is cordova.
      * Check network satus and update.
      * Subscribe network status and update app.
      * Alert offline message. 
      */
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
      /*
     * check if platform is browser.
     * Check network satus and update.
     * Subscribe network status and update app.
     * Alert offline message.
     */
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
   *  Process Order when user online and redirect to order tab.
   * @_authService private
   * @_lockerService private
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
  *  Logout current user and redirect to login page.
  * @Isloggin private
  * @_commonService private
  * @_router private
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
  * check and process pending orders.
  * @_lockerService private
  * @_router private
  * @Isloggin private
  * @subscriptions private
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
        /**
         * Redirect to app order tab
         */
        if (evt.url == '/app/orders') {
          this._commonService.showTabChange('orders');
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
  * @ONLINE_TEXT public
  * @OFFLINE_TEXT public
  * @LOGOUT_TEXT public
  * @xlat private
  */
  setDefaultText() {
    this.ONLINE_TEXT = this.xlat.transform('ONLINE');
    this.OFFLINE_TEXT = this.xlat.transform('OFFLINE');
    this.LOGOUT_TEXT = this.xlat.transform('LOGOUT');
  }

  /**
   * Open loading screen.
   *  @isLoading public   
   */
  async presentLoading() {
    this.isLoading = true;
  }

  /**
  * Close loading screen.
  *  @isLoading public
  */
  async closeLoading() {
    this.ngZone.run(() => {
      this.isLoading = false;
    });
  }

  /**
  *  Show Offline Alert.
  * @param  {String} message
  * @alertController public
  * @xlat private
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
  * @param  {String} message
  * @alertController public
  * @xlat private
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
  * @param  {String} message
  * @alertController public
  * @xlat private
  */
  async showError(message) {
    const alert = await this.alertController.create({
      header: this.xlat.transform('ERROR_TITLE'),
      message: this.xlat.transform(message),
      buttons: [this.xlat.transform('OK_TITLE')]
    });
    await alert.present();
  }


  /**
  * Show splash screen and load app.
  * @param  {String} message
  * @platform private
  * @statusBar private
  * @splashScreen private
  */
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
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
