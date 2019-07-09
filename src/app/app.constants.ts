import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

export class Configuration {
  constructor() {

  }

  public pageNo: number = 1;
  public pageSize: number = 10;
  public ServerAPIUrl = environment.Server;
  public ImageUrl = environment.Server;
  public ChangePasswordLink = environment.ChangePasswordLink;
  public BaseUrl = environment.BaseUrl;
  public TokenExpiryDays = 1;
  public NoOfRetryForLocation = 3;
  public MaximumDistance = 20; // in meter
  public SuplaiPedidosPlayStore = 'xxxxxxx';
  public SuplaiPedidosAppStore = 'xxxxxxxx';
}
