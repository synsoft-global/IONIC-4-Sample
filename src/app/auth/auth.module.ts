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
