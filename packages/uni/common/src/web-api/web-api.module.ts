import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { WEB_API_OPTIONS, IWebApiConfig, WebApiConfig } from './web-api.config';
import { GatewayInterceptor } from './interceptors/gateway.interceptor';
import { HandleRequestInterceptor } from './interceptors/handle-request.interceptor';
import { RealUrlPipe } from './pipes/real-url.pipe';

@NgModule({
  imports: [
    HttpClientModule
  ],
  exports: [
    RealUrlPipe
  ],
  declarations: [
    RealUrlPipe
  ]
})
export class WebApiModule {

  static forRoot(options?: IWebApiConfig): ModuleWithProviders {
    return {
      ngModule: WebApiModule,
      providers: [
        { provide: WEB_API_OPTIONS, useValue: options },
        WebApiConfig,
        { provide: HTTP_INTERCEPTORS, useClass: GatewayInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: HandleRequestInterceptor, multi: true }
      ]
    };
  }

}
