import { InjectionToken } from '@angular/core';
import { Routes } from '@angular/router';
import { IWebApiConfig, IAuthConfig } from '@uni/common';

export interface IBackendConfig {
  production: boolean;
  name: string;
  moduleName: string;
  routes: Routes;
  WebApiConfig: IWebApiConfig;
  AuthConfig: IAuthConfig;
}

export const BACKEND_CONFIG = new InjectionToken<IBackendConfig>('BACKEND_CONFIG');
