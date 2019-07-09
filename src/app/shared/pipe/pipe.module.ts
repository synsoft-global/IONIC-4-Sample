/*!
 * Pipe module
 * @description list of all common pipe used in app.
 * @author   Ajay Mishra <ajaymishra@synsoftglobal.com> <https://synsoftglobal.com>
 * @license  MIT
 * @see https://github.com/synsoft-global/IONIC-4-Sample
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/compiler/src/core';


import { ArraySortOrderPipe, thumbnailUrlPipe, logoThumbnailUrlPipe } from './common.pipe';

@NgModule({
  declarations: [ArraySortOrderPipe, thumbnailUrlPipe, logoThumbnailUrlPipe],
  providers: [ArraySortOrderPipe, thumbnailUrlPipe, logoThumbnailUrlPipe],
  exports: [CommonModule, ArraySortOrderPipe, thumbnailUrlPipe, logoThumbnailUrlPipe],

})


export class PipeModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PipeModule,
      providers: [ArraySortOrderPipe, thumbnailUrlPipe, logoThumbnailUrlPipe]
    }
  }
}


import { XlatPipe } from './xlat.pipe';

@NgModule({
  declarations: [XlatPipe],
  providers: [XlatPipe],
  exports: [CommonModule, XlatPipe],

})

/**
* @XlatPipeModule
* Export pipe module.
*/
export class XlatPipeModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: XlatPipeModule,
      providers: [XlatPipe]
    }
  }
}
