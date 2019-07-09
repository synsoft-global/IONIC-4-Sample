/**
 * This class provides the NameList service with methods to read names and add names.
 */
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';


var self: any;
@Injectable()
export class LockerService {

  constructor() {
    self = this;
  }

  /**
  *  Check Local storage support
  *
  */
  localStoreSupport() {
    try {
      var supported = 'localStorage' in window && window['localStorage'] !== null;
      if (supported) {
        localStorage.setItem("storage", ""); localStorage.removeItem("storage");
        return supported;
      }
    } catch (e) {
      return false;
    }
  }
  /**
   *  Set local storage
   *
   */
  set(name, value, days) {
    if (days == undefined || days == 'null') { days = 1; }

    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      var expires = "; expires=" + date.toString();
    }
    else {
      var expires = "";
    }
    if (this.localStoreSupport()) {
      localStorage.setItem(name, value);

    }
    else {
      document.cookie = name + "=" + value + expires + "; path=/";
    }
  }

  /**
  *  Remove local storage
  *  */
  removeStorage(name) {
    try {
      localStorage.removeItem(name);
      localStorage.removeItem(name + '_expiresIn');
    } catch (e) {
      return false;
    }
    return true;
  }
  /**
   *  get item from Local storage
   *
   */
  get(name): any {
    if (this.localStoreSupport()) {
      try {
        let ret = localStorage.getItem(name);
        switch (ret) {
          case 'true':
            return true;
          case 'false':
            return false;
          default:
            return ret;
        }
      } catch (e) {
        return null;
      }


    }
    else {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) {
          var ret = c.substring(nameEQ.length, c.length);
          switch (ret) {
            case 'true':
              return true;
            case 'false':
              return false;
            default:
              return ret;
          }
        }
      }
      return null;
    }
  }
  /**
  *  Delete item from local storage
  *
  */
  del(name) {
    if (this.localStoreSupport()) {
      localStorage.removeItem(name);
    }
    else {
      this.set(name, "", -1);
    }
  }

  /**
  *  Check token for expire.
  *
  */

  isTokenExpired() {
    var token = this.get('demo_token');
    //return this.jwtHelper.isTokenExpired(token);
  }

}



