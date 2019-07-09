import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LockerService } from '../../services';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  currentYear: number;
  isLoggedIn: boolean = false;
  constructor(private _router: Router, private _lockerService: LockerService) { }

  ngOnInit() {
    if (!this._lockerService.get('demo_token') || this._lockerService.get('demo_token') == 'undefined' || this._lockerService.get('demo_token') == 'myToken') {
      this.isLoggedIn = false;
    }
    else {
      this.isLoggedIn = true;
    }
  }

}
