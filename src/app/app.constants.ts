/*!
 * App Constant
 * @description This file include all configuration related variables.
 * @author   Ajay Mishra <ajaymishra@synsoftglobal.com> <https://synsoftglobal.com>
 * @license  MIT
 * @see https://github.com/synsoft-global/IONIC-4-Sample
 */

import { environment } from '../environments/environment';

/**
* @Configuration
* Export Configuration variable.
* @pageNo public
* @pageSize public
* @ServerAPIUrl public
* @ImageUrl public
* @ChangePasswordLink public
* @BaseUrl public
* @TokenExpiryDays public
* @NoOfRetryForLocation public
* @MaximumDistance public
* @SuplaiPedidosPlayStore public
* @SuplaiPedidosAppStore public
*/
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
