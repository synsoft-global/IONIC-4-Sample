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
import { HeaderComponent, FooterComponent } from './shared/layout/index';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { Network } from '@ionic-native/network/ngx';
import { NetworkService } from './shared/services/network';
import { XlatPipeModule } from './shared/pipe/pipe.module';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { Globalization } from '@ionic-native/globalization/ngx';
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';
import { FileUploadModule } from 'ng2-file-upload';
import { Contacts } from '@ionic-native/contacts';

export const cloudinaryLib = {
  Cloudinary: Cloudinary
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(),
    SharedModule.forRoot(),
    FileUploadModule,
    XlatPipeModule.forRoot(),
    AppRoutingModule,
    CloudinaryModule.forRoot(cloudinaryLib, { cloud_name: 'xxxxxx', upload_preset: 'xxxxxxxx' }),
    //ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
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
export class AppModule { }
