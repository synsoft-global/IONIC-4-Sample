/*!
 * This file export shared module.
 * import all common module and translate pipe.
 * @author   Ajay Mishra <ajaymishra@synsoftglobal.com> <https://synsoftglobal.com>
 * @license  MIT
 * @see https://github.com/synsoft-global/IONIC-4-Sample
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { AuthService, CommonService, LockerService, NetworkService } from './services';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { XlatPipeModule } from './pipe/pipe.module';
import { AuthGuard } from './services/guards/auth-guard.service';

@NgModule({
  imports: [
    CommonModule, RouterModule, XlatPipeModule.forRoot()
  ],
  providers: [],
  exports: [CommonModule, FormsModule, RouterModule],

})

/**
 * @SharedModule
 * import providers (lockerserice, CommonService, AuthService, NetworkService, AuthGuard)
 */
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [LockerService, CommonService, AuthService, NetworkService, AuthGuard]
    }
  }
}
