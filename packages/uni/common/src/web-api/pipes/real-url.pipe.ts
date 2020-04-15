import { Pipe, PipeTransform } from '@angular/core';
import { WebApiConfig } from '../web-api.config';

@Pipe({name: 'realUrl'})
export class RealUrlPipe implements PipeTransform {

  private _gatewayUrl: string;

  constructor(
    protected config: WebApiConfig
  ) {
    this._gatewayUrl = config.gatewayUrl;
    if (this._gatewayUrl.length === 0) {
      this._gatewayUrl = '/';
    }
    if (this._gatewayUrl.substr(-1) !== '/') {
      this._gatewayUrl += '/';
    }
  }

  /**
   * 转化 Url 为真实地址
   * @param url 原 Url 地址
   */
  transform(url: string): string {
    if (!url || url.length === 0) { return ''; }
    if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
      return url;
    }
    return this._gatewayUrl + (url.indexOf('/') === 0 ? url.substr(1) : url);
  }
}
