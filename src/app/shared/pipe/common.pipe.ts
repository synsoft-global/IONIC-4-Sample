/*!
 * Common Pipe
 * @description this file include function defination of all common pipe.
 * @author   Ajay Mishra <ajaymishra@synsoftglobal.com> <https://synsoftglobal.com>
 * @license  MIT
 * @see https://github.com/synsoft-global/IONIC-4-Sample
 */
import { Injectable, Pipe, PipeTransform } from '@angular/core';

/**
  * @sortOrder
  * Sort order by order date.
  *  @param array:Array
  *  @return array: Array
  */
@Pipe({
  name: "sortOrder"
})
export class ArraySortOrderPipe implements PipeTransform {
  transform(array: any): any[] {
    if (!Array.isArray(array)) {
      return;
    }
    array.sort((a: any, b: any) => {
      if (a['order']['orderDate'] < b['order']['orderDate']) {
        return 1;
      } else if (a['order']['orderDate'] > b['order']['orderDate']) {
        return -1;
      } else {
        return 0;
      }
    });
    return array;
  }
}

/**
  * @thumbnailUrl
  * Scale logo image url from cloudinary
  *  @param logo:string
  *  @return response:string
  */
@Pipe({
  name: "thumbnailUrl"
})
@Injectable()
export class thumbnailUrlPipe implements PipeTransform {
  transform(picture: any): any {
    let image_u = '';
    let img: any;
    image_u = '';
    img = [];
    let small_img: any;
    image_u = picture;
    small_img = picture;
    img = image_u.split("/image/upload/");
    if (img.length > 1) {
      small_img = img[0] + '/image/upload/w_50,c_scale/' + img[1];
    }
    return small_img;
  }
}

/**
  * @logoThumbnailUrl
  * Scale logo image url from cloudinary
  *  @param logo:string
  *  @return response:string
  */
@Pipe({
  name: "logoThumbnailUrl"
})
@Injectable()
export class logoThumbnailUrlPipe implements PipeTransform {
  transform(logo: any): any {
    let image_u = '';
    let img: any;
    image_u = '';
    img = [];
    let small_img: any = '';
    if (!!logo) {
      image_u = logo;
      small_img = logo;
      img = image_u.split("/image/upload/");
      if (img.length > 1) {
        small_img = img[0] + '/image/upload/h_100,c_scale/' + img[1];
      }
    }
    return small_img;
  }
}