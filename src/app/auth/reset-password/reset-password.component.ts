import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, Form } from '@angular/forms';
import { AuthService, LockerService, matchingPasswords, CommonService } from '../../shared/services/index';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { _ } from 'underscore';
import { XlatPipe } from '../../shared/pipe/xlat.pipe';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  forgotPasswordForm: FormGroup;    // Form for login
  public title: string;       // title for sign in by role
  public href: string = "";
  public user: any;
  public products: any;
  public suppliers: any;
  public currentSupplier: any;
  public userSuppliers: any;
  Isloggin: boolean = false;
  loginPage: boolean = true;
  encodedId: any;
  linkExpired: boolean = false;
  encodedToken: any;

  subscriptions: any[] = [];
  constructor(
    private _fb: FormBuilder,
    private _lockerService: LockerService,
    private _authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public alertController: AlertController,
    private _commonService: CommonService,
    private xlat: XlatPipe
  ) {
    this.changePasswordForm = _fb.group({
      password: new FormControl('', [
        Validators.required,
      ]),
      password2: new FormControl('', [
        Validators.required,
      ]),
    }, {
        validator: matchingPasswords('password', 'password2', '')
      });
  }


  /**
  * Init check password function and verify token.
  *
  * */

  ngOnInit() {
    if (!!this._lockerService.get('demo_token')) {
      this.Isloggin = true;
      this.router.navigate(['/app/orders']);
    }

    this._commonService.showLoading(true);

    this.subscriptions.push(this.route.params.subscribe(params => {
      // get company id from url
      this.encodedId = params['id'];
      this.encodedToken = params['token'];

    }))


    this._authService.getUserById(this.encodedId).subscribe(user => {
      if (user && user.user.changePassword) {
        let requestDate = new Date(user.user.changePassword.requestDate);
        console.log('requestDate');
        console.log(requestDate);
        let now = new Date();

        let requestDateTransformed = new Date(requestDate).getTime();
        console.log('requestDateTransformed');
        console.log(requestDateTransformed);

        requestDateTransformed += 60 * 60000;



        let threshold = new Date(requestDateTransformed);

        console.log(threshold);
        console.log(now);

        if (threshold < now) {
          this.linkExpired = true; // expired link for changing passwords
          this.showError("LINK_EXPIRED");
          this.router.navigate(['/']);
        }
      } else {
        this.showError("INVALID_USER");
        //this.router.navigate(['/']);
        this._commonService.showLoading(false);
      }
    }, err => {
      this.showError("INVALID_USER");
      // this.router.navigate(['/']);
      this._commonService.showLoading(false);
    })

  }


  /**
  * Change password
  *
  * */
  changePassword(value) {

    var data = {
      token: this.encodedToken,
      id: this.encodedId,
      password: value.password1
    };


    this._authService.changePasswordCheck(data).subscribe(user => {
      if (!user.error) {
        this._authService.updateuserWithoutLogin({ data: { user: user.user } }).subscribe(data => {
          this.router.navigate(['/'])
          this.showSuccess('CHANGE_PASSWORD_SUCCESS');
        });
      } else {
        this.linkExpired = true;
      }
    });
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

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
