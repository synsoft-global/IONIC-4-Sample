/*!
 * Auth Module
 * @description this file import all modules for login component.
 * @author   Ajay Mishra <ajaymishra@synsoftglobal.com> <https://synsoftglobal.com>
 * @license  MIT
 * @see https://github.com/synsoft-global/IONIC-4-Sample
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { IonicModule } from '@ionic/angular';
import { XlatPipeModule } from '../shared/pipe/pipe.module';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    XlatPipeModule.forRoot(),
    ReactiveFormsModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
