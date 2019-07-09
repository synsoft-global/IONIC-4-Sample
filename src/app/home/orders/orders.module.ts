/*!
 * Order Module
 * @description this file load all order related modules.
 * @author   Ajay Mishra <ajaymishra@synsoftglobal.com> <https://synsoftglobal.com>
 * @license  MIT
 * @see https://github.com/synsoft-global/IONIC-4-Sample
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { IonicModule } from '@ionic/angular';
import { PipeModule } from '../../shared/pipe/pipe.module';
import { XlatPipeModule } from '../../shared/pipe/pipe.module';
import { CurrencyPipe } from '@angular/common';

/**
* @NgModule
* declar order component.
* Import common module.
* Import Ionic module.
* Import pipe module.
*/
@NgModule({
  declarations: [OrdersComponent],
  imports: [
    CommonModule,
    FormsModule,
    OrdersRoutingModule,
    IonicModule.forRoot(),
    XlatPipeModule.forRoot(),
    PipeModule.forRoot()
  ],
  providers: [CurrencyPipe],
  entryComponents: []
})
export class OrdersModule { }
