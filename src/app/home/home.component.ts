/*!
 * Home Component
 * @description this file include home component feature.
 * @author   Ajay Mishra <ajaymishra@synsoftglobal.com> <https://synsoftglobal.com>
 * @license  MIT
 * @see https://github.com/synsoft-global/IONIC-4-Sample
 */
import { Component, ViewChild } from '@angular/core';
import { CommonService } from '../shared/services/index';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html'
})
export class HomeComponent {
  subscriptions: any[] = [];

  /**
   * @constructor
   * @param  {CommonService} private_commonService
   */
  constructor(
    private _commonService: CommonService

  ) {
  }

  /**
     * Called once, before the instance is destroyed.
     * Add 'implements OnDestroy' to the class.
     *
    */
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
