import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthService, AuthConfig } from '@uni/common';
import { CookieService } from 'ngx-cookie';

import { BackendPassportModule } from './modules/passport/passport.module';
import { BackendThemeModule } from './modules/theme/theme.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ScheduleModule } from './modules/schedule/schedule.module';

import { BackendService } from './services/backend.service';
import { logicServices } from './logic/services';
import { initial } from './backend.helpers';

export function authServiceFactory(config: AuthConfig, httpClient: HttpClient, cookie: CookieService, helper: BackendService) {
  return new AuthService(config, httpClient, cookie, helper);
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DashboardModule,
    ProfileModule,
    ScheduleModule,
    BackendPassportModule,
    BackendThemeModule
  ]
})
export class BackendModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: BackendModule,
      providers: [
        BackendService,
        { provide: AuthService, useFactory: authServiceFactory, deps: [AuthConfig, HttpClient, CookieService, BackendService] },
        { provide: APP_INITIALIZER, useFactory: initial, deps: [BackendService], multi: true },
        ...logicServices
      ]
    };
  }

}
