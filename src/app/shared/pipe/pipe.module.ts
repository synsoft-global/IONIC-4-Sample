import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/compiler/src/core';


import { CustomerProductsFilterPipe, CustomerFilterPipe, ArraySortPipe, ArraySortOrderPipe, thumbnailUrlPipe, logoThumbnailUrlPipe } from './common.pipe';

@NgModule({
  declarations: [CustomerProductsFilterPipe, CustomerFilterPipe, ArraySortPipe, ArraySortOrderPipe, thumbnailUrlPipe, logoThumbnailUrlPipe],
  providers: [CustomerProductsFilterPipe, CustomerFilterPipe, ArraySortPipe, ArraySortOrderPipe, thumbnailUrlPipe, logoThumbnailUrlPipe],
  exports: [CommonModule, CustomerProductsFilterPipe, CustomerFilterPipe, ArraySortPipe, ArraySortOrderPipe, thumbnailUrlPipe, logoThumbnailUrlPipe],

})

export class PipeModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PipeModule,
      providers: [CustomerProductsFilterPipe, CustomerFilterPipe, ArraySortPipe, ArraySortOrderPipe, thumbnailUrlPipe, logoThumbnailUrlPipe]
    }
  }
}


import { XlatPipe } from './xlat.pipe';

@NgModule({
  declarations: [XlatPipe],
  providers: [XlatPipe],
  exports: [CommonModule, XlatPipe],

})

export class XlatPipeModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: XlatPipeModule,
      providers: [XlatPipe]
    }
  }
}
