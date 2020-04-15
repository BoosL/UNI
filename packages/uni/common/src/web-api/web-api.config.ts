import { Injectable, Inject, InjectionToken } from '@angular/core';

export const WEB_API_OPTIONS = new InjectionToken<IWebApiConfig>('WEB_API_OPTIONS');

export interface IWebApiConfig {
  gatewayUrl?: string;
  requestHeaders?: { [name: string]: string | string[] };
  debug?: boolean;
}

@Injectable()
export class WebApiConfig {

  gatewayUrl: string;
  requestHeaders: { [name: string]: string | string[] } = {};
  debug = false;

  constructor(@Inject(WEB_API_OPTIONS) options: IWebApiConfig) {
    Object.assign(this, options);
  }

}
