import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { IonicModule } from '@ionic/angular';
import { PipeModule } from '../../shared/pipe/pipe.module';
import { XlatPipeModule } from '../../shared/pipe/pipe.module';

import { CurrencyPipe } from '@angular/common';

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
