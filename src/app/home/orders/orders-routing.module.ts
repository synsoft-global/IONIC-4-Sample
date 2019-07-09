/*!
 * Order Routing
 * @description this file include order page routhing.
 * @author   Ajay Mishra <ajaymishra@synsoftglobal.com> <https://synsoftglobal.com>
 * @license  MIT
 * @see https://github.com/synsoft-global/IONIC-4-Sample
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './orders.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: OrdersComponent,
      }
    ]
  }
];


/**
* @NgModule
* Export order routes
*/
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
