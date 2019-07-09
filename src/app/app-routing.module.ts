/*!
 * App Routing module
 * @description This file include all routing path of app.
 * @author   Ajay Mishra <ajaymishra@synsoftglobal.com> <https://synsoftglobal.com>
 * @license  MIT
 * @see https://github.com/synsoft-global/IONIC-4-Sample
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/**
 *  Set routes for Login and Order app page.
 *
 */
const routes: Routes = [
  {
    path: '',
    loadChildren: './auth/auth.module#AuthModule'
  },
  { path: 'app', loadChildren: './home/home.module#HomePageModule' }
];

/**
* @NgModule
* Import router module.
* @routes const
*/
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})

/**
* Export app routing module.
*/
export class AppRoutingModule { }
