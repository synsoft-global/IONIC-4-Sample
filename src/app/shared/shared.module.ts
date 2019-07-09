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

export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [LockerService, CommonService, AuthService, NetworkService, AuthGuard]
    }
  }
}
