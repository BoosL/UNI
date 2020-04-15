import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface IAuthHelper {
  loginCallback(payload: any): Observable<boolean>;
  logoutCallback(): Observable<boolean>;
  loginValidCallback(): Observable<boolean>;
  getCurrentUser(): any;
}

export const AUTH_HELPER = new InjectionToken<IAuthHelper>('AUTH_HELPER');
