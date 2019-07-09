/*!
 * Login component class.
 * Handle User login and forgot password.
 * Load Login Page HTML and after from submit redirect order page.
 * @author   Ajay Mishra <ajaymishra@synsoftglobal.com> <https://synsoftglobal.com>
 * @see https://github.com/synsoft-global/IONIC-4-Sample
 * @license  MIT
 */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, Form } from '@angular/forms';
import { AuthService, LockerService, Validator, CommonService } from '../../shared/services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { Configuration } from '../../../app/app.constants';
import { AlertController } from '@ionic/angular';
import { _ } from 'underscore';
import { XlatPipe } from '../../shared/pipe/xlat.pipe';

/**
 * Component .
 * @param {!webdriver.Capabilities} capabilities The capabilities object.
 * @return {!Options} The ChromeDriver options.
 */

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;    // Form for login
  public title: string;       // title for sign in by role
  public href: string = "";
  public user: any;
  public products: any;
  public suppliers: any;
  public currentSupplier: any;
  public userSuppliers: any;
  Isloggin: boolean = false;
  public loginPage: boolean = true;

  subscriptions: any[] = [];  // stores all service subscriptions

  /**
   * @constructor
   * @param  {FormBuilder} private_fb: used to create forms
   * @param  {LockerService} private_lockerService: used to handle local storage
   * @param  {AuthService} private_authService: authentication service
   * @param  {Router} privaterouter: used for routing
   * @param  {ActivatedRoute} privateroute
   * @param  {ToastrService} private_toastr: used to generate toast notifications
   * @param  {AlertController} public_alertController: used to generate alert notifications
   * @param  {CommonService} private_commonService: used to invoke common service
   * @param  {Configuration} private_config: used for config variable access
   * @param  {XlatPipe} private_xlat: used to translate instant conversion
   */
  constructor(private _fb: FormBuilder,
    private _lockerService: LockerService,
    private _authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public alertController: AlertController,
    private _commonService: CommonService,
    private _config: Configuration,
    private xlat: XlatPipe) {


    /**
    * Login form group.
    * username control. 
    * password conrol.
    */
    this.loginForm = _fb.group({
      username: new FormControl('', [
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validator.required
      ]),
    });

    /**
   * forgot password form group.
   * username control. 
   */
    this.forgotPasswordForm = _fb.group({
      username: new FormControl('', [
        Validators.required,
        Validator.emailValidator
      ])
    });

    /**
    * Watch login property. After successfully logged-in change login flag.
    * username control.
    */
    this.subscriptions.push(_commonService.loginPropertyChanged$.subscribe(
      data => {
        if (data)
          this.Isloggin = true;
        else
          this.Isloggin = false;
      })
    );
  }

  /**
  * Call ngOninit when login componenet loaded. 
  * Check if token already exists return home page.
  * username control.
  */
  ngOnInit() {
    if (!this._lockerService.get('demo_token') || this._lockerService.get('demo_token') == 'undefined' || this._lockerService.get('demo_token') == 'myToken') {
      this.router.navigate(['/']);
      this.Isloggin = false;
    }
    else {
      this.Isloggin = true;
      this.router.navigate(['/app/orders']);
    }
    this._commonService.showLoading(false);
  }

  /**
   * Handles the Sign In request
   * @param  {FormGroup} value: loginForm
   */
  onSubmit(value) {
    this._commonService.showLoading(true);

    const loginFormData = {
      username: value.username.trim(),
      password: value.password.trim()
    };

    /**
     * Handles the Sign In request
      * @param  {FormGroup} value: loginForm     
    */
    this.subscriptions.push(this._authService.GetLoginInfo(loginFormData).subscribe(
      res => {
        // on success set the auth token and route to /dashboard
        if (res) {
          if ((res.url == 'app.orders' || res.url == 'app.supplierOrders') && res.user && res.user.userType == 'supplier') {
            this._lockerService.set('demo_token', res.token, this._config.TokenExpiryDays);
            this._lockerService.set('url', res.url, this._config.TokenExpiryDays);
            this.user = res.user;
            this._lockerService.set('user', JSON.stringify(this.user), this._config.TokenExpiryDays);

            this._lockerService.set('language', this.user.language, this._config.TokenExpiryDays);

            let now = +new Date();
            let freeAccount = {
              inventories: true,
              reports: true,
              saveOrders: true,
              multipleAddresses: true,
            };

            if (this.user.accountExpires < now) {
              this.user.accountTypeName = 'freeAccount';
              this.user.accountType = freeAccount;
              this._authService.Updateuser({ user: this.user });
            }
            this._commonService.clearLogoutHistory();
            this._commonService.showLoading(false);
            this.Isloggin = true;
            this.router.navigate(['/app/orders']);
          } else {
            this.showError("USERNAME_NOT_FOUND");
            this.router.navigate(['/'])
          }
          // this.showSuccess("Login successfully/");
        }
        // on unsuccessful login attempt reroute to login
        else {
          this.Isloggin = false;
          this.showError("USERNAME_NOT_FOUND");
          this.router.navigate(['/'])
          this._commonService.showLoading(false);
        }
      },
      err => {
        this.Isloggin = false;
        this.showError("USERNAME_NOT_FOUND");
        this._commonService.showLoading(false);
      }
    ))
  }

  /**
  * Handles the forgot password request
  * @param  {FormGroup} value: forgotPasswordForm
  */
  onPasswordChanget(value) {
    this._commonService.showLoading(true);

    /**
     * call to login service
     * @param  {FormGroup} value: forgotPasswordForm
     */
    let message = {
      L1: this.xlat.transform('PSW_CHANGE_L1'),
      L2: this.xlat.transform('PSW_CHANGE_L2'),
      L3: this.xlat.transform('PSW_CHANGE_L3')
    };

    let fromString = this.xlat.transform('FROM_STRING');
    let toString = value.username;
    let subjectString = this.xlat.transform('PSW_CHANGE');

    let token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    this.subscriptions.push(this._authService.getUserByEmail(value.username).subscribe(user => {
      if (user) {
        var htmlString = this._config.ChangePasswordLink + user.user._id + '/' + token;

        user.user.changePassword = {};
        user.user.changePassword.requestDate = new Date();
        user.user.changePassword.token = token;

        var pswData = {
          data: {
            user: user.user,
            from: fromString, // sender address
            to: toString, // list of receivers
            subject: subjectString, // Subject line
            text: htmlString, // plaintext body FALTA AGREGAR TEXTO!!!
            html: message.L1 + message.L2 + '<a href =' + htmlString + '>' + this.xlat.transform('CLICK_HERE') + '</a></b><br><br>' + message.L3
          }
        };

        this.subscriptions.push(this._authService.changePasswordMail(pswData).subscribe(
          res => {
            this._authService.updateuserWithoutLogin({ data: { user: user.user } }).subscribe(res => {
              this.showSuccess('SUCCESSFUL_EMAIL');
              this._commonService.showLoading(false);
            }, err => {
              this.Isloggin = false;
              this.showError("EMAIL_NOT_FOUND");
              this._commonService.showLoading(false);
            })
          }, err => {
            this.Isloggin = false;
            this.showError("EMAIL_NOT_FOUND");
            this._commonService.showLoading(false);
          }))
      } else {
        this._commonService.showLoading(false);
        this.showError("EMAIL_NOT_FOUND");
      }
    }))
  }


  /**
    * Show success pop up
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
    * On page change event switch login and forgot password view.
    * @loginPage public
    * */
  onChangePage() {
    this.loginPage = !this.loginPage;
  }

  /**
     * Called once, before the instance is destroyed.
     * Add 'implements OnDestroy' to the class.
     * */
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
