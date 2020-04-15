import { Injectable, Inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WebApiConfig } from '../web-api.config';

@Injectable()
export class GatewayInterceptor implements HttpInterceptor {

  protected gatewayUrl: string;

  constructor(
    protected config: WebApiConfig
  ) {
    this.gatewayUrl = config.gatewayUrl;
    if (this.gatewayUrl.length === 0) {
      this.gatewayUrl = '/';
    }
    if (this.gatewayUrl.substr(-1) !== '/') {
      this.gatewayUrl += '/';
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const request = req.clone({ url: this.getUrl(req.url) });
    return next.handle(request);
  }

  protected getUrl(url: string): string {
    if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
      return url;
    }
    return this.gatewayUrl + (url.indexOf('/') === 0 ? url.substr(1) : url);
  }

}
