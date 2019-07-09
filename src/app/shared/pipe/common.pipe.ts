import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customerProductsFilter'
})
@Injectable()
export class CustomerProductsFilterPipe implements PipeTransform {

  transform(customerProducts: any[], searchText: string, searchColumn: string): any[] {
    if (!customerProducts) return [];
    if (!searchText) return customerProducts;
    searchText = searchText.toLowerCase();
    if (searchColumn == 'name') {
      return customerProducts.filter(it => {
        return it.name.toLowerCase().includes(searchText);
      });
    } else if (searchColumn == 'category1') {
      return customerProducts.filter(it => {
        return (it['categories'] && it['categories']['category1'] == searchText);
      });
    } else if (searchColumn == 'category2') {
      return customerProducts.filter(it => {
        return (it['categories'] && it['categories']['category2'] == searchText);
      });
    } else {
      return customerProducts;
    }


  }
}

@Pipe({
  name: 'customerFilter'
})
@Injectable()
export class CustomerFilterPipe implements PipeTransform {

  transform(customers: any[], searchText: string): any[] {
    if (!customers) return [];
    if (!searchText) return customers;
    searchText = searchText.toLowerCase();
    return customers.filter(it => {
      return it.restaurantName.toLowerCase().includes(searchText);
    });
  }
}

@Pipe({
  name: "sort"
})
export class ArraySortPipe implements PipeTransform {
  transform(array: any, field: string): any[] {
    if (!Array.isArray(array)) {
      return;
    }
    array.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        return -1;
      } else if (a[field] > b[field]) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}

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




