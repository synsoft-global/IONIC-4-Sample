import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Route, Router, ActivatedRoute } from '@angular/router';
import { LockerService, CommonService } from '../../services/index';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  fullName: String = '';
  isLoggedIn: boolean = false;

  constructor(private _router: Router, private _lockerService: LockerService, private _commonService: CommonService) { }

  ngOnInit() {
    if (!this._lockerService.get('demo_token') || this._lockerService.get('demo_token') == 'undefined' || this._lockerService.get('demo_token') == 'myToken') {
      this.isLoggedIn = false;
    }
    else {
      this.isLoggedIn = true;
      this.fullName = this._lockerService.get('name');
    }
  }






}
