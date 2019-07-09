import { Component, ViewChild } from '@angular/core';
import { CommonService } from '../shared/services/index';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html'
})
export class HomeComponent {
  subscriptions: any[] = [];

  constructor(
    private _commonService: CommonService

  ) {
  }


  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
