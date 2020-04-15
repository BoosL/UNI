import { Injectable, Inject, InjectionToken } from '@angular/core';

export const AUTH_OPTIONS = new InjectionToken<IAuthConfig>('AUTH_OPTIONS');

export interface IAuthConfig {
  loginUrl?: string;
  logoutUrl?: string;
  refreshUrl?: string;
  tokenPrefix?: string; // token 前缀
  useServerTokenDomain?: boolean; // 是否使用服务器回传的 token 域名
}

@Injectable()
export class AuthConfig {

  loginUrl = 'login';
  logoutUrl = 'logout';
  refreshUrl = 'refresh';
  tokenPrefix = '';
  useServerTokenDomain = false;

  constructor(@Inject(AUTH_OPTIONS) options: IAuthConfig) {
    Object.assign(this, options);
  }

}
