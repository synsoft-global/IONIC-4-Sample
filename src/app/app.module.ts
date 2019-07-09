/*!
 * App Module
 * @description This file have list of all imported modules.
 * @author   Ajay Mishra <ajaymishra@synsoftglobal.com> <https://synsoftglobal.com>
 * @license  MIT
 * @see https://github.com/synsoft-global/IONIC-4-Sample
 */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpModule } from '@angular/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Configuration } from './app.constants';
import { SharedModule } from './shared/shared.module';

import { Network } from '@ionic-native/network/ngx';
import { NetworkService } from './shared/services/network';
import { XlatPipeModule } from './shared/pipe/pipe.module';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { Globalization } from '@ionic-native/globalization/ngx';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';
import { FileUploadModule } from 'ng2-file-upload';
import { Contacts } from '@ionic-native/contacts';

export const cloudinaryLib = {
  Cloudinary: Cloudinary
};

/*
* @NgModule
* Import all third party modules.
* Add Network,Camera,Contacts and Network service provider.
* Bootstrap app component.
* Include cloudinary module for third party image upload.
*/
@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(),
    SharedModule.forRoot(),
    FileUploadModule,
    XlatPipeModule.forRoot(),
    AppRoutingModule,
    CloudinaryModule.forRoot(cloudinaryLib, { cloud_name: 'xxxxxx', upload_preset: 'xxxxxxxx' })
  ],
  providers: [
    Network,
    StatusBar,
    SplashScreen,
    NetworkService,
    Globalization,
    QRScanner,
    Camera,
    Contacts,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Configuration
  ],
  bootstrap: [AppComponent]
})

/**
* @AppModule
* Export app module.
*/
export class AppModule { }
