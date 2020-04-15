import { Injectable, Optional, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';
import { WebApiHttpResponse } from '../../web-api/web-api';
import { AuthConfig } from '../auth.config';
import { AuthToken } from '../models/auth-token.model';
import { JwtToken } from '../models/jwt-token.models';
import { IAuthHelper, AUTH_HELPER } from './auth.helper';
import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, mergeMap, tap } from 'rxjs/operators';
import { utc, unix } from 'moment';
import * as lodash from 'lodash';
// @ts-ignore
import jwtDecode from 'jwt-decode';

@Injectable()
export class AuthService {

  private _authSubject = new BehaviorSubject<boolean>(false);

  constructor(
    protected config: AuthConfig,
    protected httpClient: HttpClient,
    protected cookie: CookieService,
    @Optional() @Inject(AUTH_HELPER) protected helper: IAuthHelper,
  ) { }

  /**
   * 获得登陆状态变更的订阅
   */
  public getAuthSubject(): Observable<boolean> {
    return this._authSubject as Observable<boolean>;
  }

  /**
   * 获得当前登陆用户
   */
  public getCurrentUser(): any {
    return this.helper ? this.helper.getCurrentUser() : null;
  }

  /**
   * 用户登陆
   * @param credential 登陆凭证
   */
  public login(credential: any): Observable<boolean> {
    const loginUrl = this.config.loginUrl;
    return this.httpClient.post(loginUrl, credential).pipe(
      map((response: WebApiHttpResponse) => response.getModel<AuthToken>(this._resolve)),
      tap((token) => this._putAccessToken(token)),
      mergeMap((token) => this._callback('login', token.payload)),
      map((success) => {
        if (!success) {
          throw new Error('登陆失败，请检查用户名或密码');
        }
        // this._authSubject.next(true);
        return true;
      }),
      catchError((e) => {
        this._removeAccessToken();
        return throwError(e);
        // throw e;
      })
    );
  }

  /**
   * 注销登陆
   */
  public logout(): Observable<boolean> {
    const logoutUrl = this.config.logoutUrl;
    return this.httpClient.post(logoutUrl, null).pipe(
      mergeMap(() => this._callback('logout')),
      tap(() => {
        this._removeAccessToken();
        this._authSubject.next(false);
      }),
      catchError(() => of(false))
    );
  }

  /**
   * 判断当前是否登陆
   */
  public loginValid(): Observable<boolean> {
    // 数据格式错误或数据缺失
    const token = this._getAccessToken();
    if (!token) { return of(false); }

    // TOKEN已完全过期
    const tokenExpiredTime = token.exp;
    const time = utc().unix();
    if (tokenExpiredTime < time) { return of(false); }

    // TOKEN如果即将过期（10分钟）则需要刷新TOKEN
    return ((tokenExpiredTime - time > 10 * 60) ? this._callback('loginValid') : this._refresh()).pipe(
      map((success) => {
        if (!success) {
          throw new Error('登陆令牌已经失效，请重新登陆');
        }
        this._authSubject.next(true);
        return true;
      }),
      catchError(() => {
        // this._removeAccessToken();
        // this._loginedUser = null;
        return of(false);
      })
    );
  }

  /**
   * 执行回调
   * @param action 当前动作
   * @param payload 携带参数
   */
  private _callback(action: string, payload?: any): Observable<boolean> {
    switch (action) {
      case 'login': {
        return this.helper ? this.helper.loginCallback(payload) : of(true);
      }

      case 'logout': {
        return this.helper ? this.helper.logoutCallback() : of(true);
      }

      case 'loginValid': {
        return this.helper ? this.helper.loginValidCallback() : of(true);
      }

      default: {
        return of(true);
      }
    }
  }

  /**
   * 加载当前登陆用户信息
   */
  /*private _loadUser(): Observable<boolean> {
      return this.httpClient.get(this.config.loginedUserUrl).pipe(
          map((response: WebApiHttpResponse) => {
              this._loginedUser = response.getModel();
              return true;
          }),
          catchError(() => of(false))
      );
  }*/

  /**
   * 刷新令牌
   */
  private _refresh(): Observable<boolean> {
    const refreshUrl = this.config.refreshUrl;
    return this.httpClient.post(refreshUrl, null).pipe(
      map((response: WebApiHttpResponse) => response.getModel<AuthToken>(this._resolve)),
      tap((token) => this._putAccessToken(token)),
      mergeMap((token) => this._callback('login', token.payload)),
      catchError(() => of(false))
    );
  }

  private _tokenKey() {
    let key = 'token';

    if (this.config.tokenPrefix) {
      key = this.config.tokenPrefix + '_' + key;
    }

    return key;
  }

  /**
   * 写入登陆令牌
   * @param authToken 待保存令牌
   */
  private _putAccessToken(authToken: AuthToken) {
    const token = this._decodeAccessToken(authToken.accessToken);
    this.cookie.put(this._tokenKey(), authToken.accessToken, {
      domain: this.config.useServerTokenDomain ? authToken.domain : null,
      expires: unix(token.exp).toDate()
    });
  }

  /**
   * 获得登陆令牌
   */
  private _getAccessToken(): JwtToken {
    return this._decodeAccessToken(this.cookie.get(this._tokenKey()) || '');
  }

  /**
   * 删除登陆令牌
   */
  private _removeAccessToken() {
    this.cookie.remove(this._tokenKey(), {
      domain: '.' + location.hostname.split('.').slice(-2).join('.')
    });
    this.cookie.remove(this._tokenKey());
  }

  /**
   * 解析服务器响应
   * @param o 服务器响应
   */
  private _resolve(o: any): AuthToken {
    const authToken = {} as AuthToken;
    authToken.accessToken = o.access_token || '';
    authToken.tokenType = o.token_type || 'bearer';
    authToken.expiresIn = o.expires_in || 0;
    authToken.domain = o.domain || null;
    authToken.payload = lodash.omit(o, ['access_token', 'token_type', 'expires_in']);
    return authToken;
  }

  /**
   * 解码 JWT token
   */
  private _decodeAccessToken(accessToken: string): JwtToken {
    if (!accessToken) {
      return null;
    }

    try {
      const token = jwtDecode(accessToken) as JwtToken;
      if (!token) {
        return null;
      }

      // 类型转换，员工ID必须是字符串类型，因为后续代码会使用 token.sub.length 来判空
      token.sub = token.sub ? token.sub.toString() : null;
      token.eleId = token.eleId ? token.eleId.toString() : null;

      if (!token.sub) {
        return null;
      }

      return token;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
