/*!
 * Auth routing
 * @description this file load all auth routes.
 * @author   Ajay Mishra <ajaymishra@synsoftglobal.com> <https://synsoftglobal.com>
 * @license  MIT
 * @see https://github.com/synsoft-global/IONIC-4-Sample
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: 'reset-password/:id/:token',
        component: ResetPasswordComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
