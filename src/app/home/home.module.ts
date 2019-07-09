import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { XlatPipeModule } from '../shared/pipe/pipe.module';

@NgModule({
  declarations: [
    HomeComponent
  ],
  entryComponents: [HomeComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot(),
    XlatPipeModule.forRoot(),
    HomeRoutingModule
  ]
})
export class HomePageModule { }
