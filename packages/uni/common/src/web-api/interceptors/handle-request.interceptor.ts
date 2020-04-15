import { Injectable, Inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { WebApiConfig } from '../web-api.config';
import { WebApiHttpResponse } from '../web-api-http-response.model';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class HandleRequestInterceptor implements HttpInterceptor {

  protected extraRequestHeaders: { [name: string]: string | string[]; };
  protected debug: boolean;

  constructor(
    protected config: WebApiConfig
  ) {
    this.extraRequestHeaders = config.requestHeaders;
    this.debug = config.debug;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const request = req.reportProgress ? req : req.clone({ headers: this.handleRequestHeaders(req.headers) });
    return next.handle(request).pipe(
      map(this.handleResponse),
      catchError((err) => this.handleError(err, this.debug))
    );
  }

  /**
   * 附加请求头
   * @param headers 待附加的请求头
   */
  protected handleRequestHeaders(headers: HttpHeaders): HttpHeaders {
    Object.keys(this.extraRequestHeaders).forEach((name) => {
      if (headers.has(name)) { return; }
      headers = headers.append(name, this.extraRequestHeaders[name]);
    });
    return headers;
  }

  /**
   * 将响应转化为 NgxExcel 可识别的响应类型
   * @param res 原始的 HTTP 响应
   */
  protected handleResponse(res: HttpEvent<any>): HttpEvent<WebApiHttpResponse> {
    return (res instanceof HttpResponse) ? res.clone<WebApiHttpResponse>({
      body: new WebApiHttpResponse(res)
    }) : res;
  }

  /**
   * 处理错误影响
   * @param response 原始的错误信息
   * @param debug 是否调试模式
   */
  protected handleError(response: any, isDebug: boolean): Observable<never> {
    if (!(response instanceof HttpErrorResponse)) {
      if (isDebug) { console.warn(response); }
      return;
    }

    const method = 'handleError' + response.status.toString();
    return typeof (this[method]) === 'function' ? this[method](response) : this.handleErrorAny(response);
  }

  /**
   * 通用错误响应处理方法
   * @param response 原始的错误信息
   */
  protected handleErrorAny(response: HttpErrorResponse): Observable<never> {
    return throwError({ error: response, message: '系统错误，请联系管理员' });
  }

  /**
   * 错误 400 响应处理方法
   * @param response 原始的错误信息
   */
  protected handleError400(response: HttpErrorResponse): Observable<never> {
    return throwError({ error: response, message: response.error.message || '请先登陆' });
  }

  /**
   * 错误 403 响应处理方法
   * @param response 原始的错误信息
   */
  protected handleError403(response: HttpErrorResponse): Observable<never> {
    return throwError({ error: response, message: response.error.message || '无权限' });
  }

  /**
   * 错误 404 响应处理方法
   * @param response 原始的错误信息
   */
  protected handleError404(response: HttpErrorResponse): Observable<never> {
    return throwError({ error: response, message: '系统错误，接口已过期' });
  }

  /**
   * 错误 422 响应处理方法
   * @param response 原始的错误信息
   */
  protected handleError422(response: HttpErrorResponse): Observable<never> {
    let message = '';
    if (response.error && response.error.errors) {
      message = Object.values(response.error.errors).map(
        (errors: string | string[]) => ((typeof (errors) === 'string') ? [errors] : errors).join('，')
      ).join('，');
    } else {
      message = '系统错误，请联系管理员';
    }
    return throwError({ error: response, message });
  }

}
