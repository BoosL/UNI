import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';

import { CookieModule } from 'ngx-cookie';
import { ContextMenuModule } from 'ngx-contextmenu';

import { WebApiModule, AuthModule, FashionIconModule } from '@uni/common';
import { BACKEND_CONFIG, BackendModule, SchoolMenuService } from '@uni/core';

import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { svgIconsProviders } from './app.svg-icons';

import zh from '@angular/common/locales/zh';
registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    NgZorroAntdModule,
    CookieModule.forRoot(),
    ContextMenuModule.forRoot(),
    FashionIconModule.forRoot(),
    WebApiModule.forRoot(environment.WebApiConfig),
    AuthModule.forRoot(environment.AuthConfig),
    BackendModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: BACKEND_CONFIG, useValue: environment },
    svgIconsProviders,
    SchoolMenuService,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
