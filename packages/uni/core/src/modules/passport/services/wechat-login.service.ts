import { Injectable, Inject } from '@angular/core';
import { BACKEND_CONFIG, IBackendConfig } from '../../../backend.config';

@Injectable()
export class WechatLoginService {

  protected gatewayUrl: string;

  constructor(
    @Inject(BACKEND_CONFIG) appConfig: IBackendConfig
  ) {
    this.gatewayUrl = appConfig.WebApiConfig.gatewayUrl || '';
    if (this.gatewayUrl.length === 0) {
      this.gatewayUrl = '/';
    }
    if (this.gatewayUrl.substr(-1) !== '/') {
      this.gatewayUrl += '/';
    }
  }

  /**
   * 获得登陆Url
   */
  public getLoginUrl() {
    const url = `/wxwork/login?back_url=${encodeURIComponent(location.protocol + '//' + location.host)}`;
    return this.gatewayUrl + (url.indexOf('/') === 0 ? url.substr(1) : url);
  }

}
