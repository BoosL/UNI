import { NgModule, ModuleWithProviders } from '@angular/core';
import { CookieModule } from 'ngx-cookie';
import { AuthGuard } from './services/auth.guard';
import { AuthService } from './services/auth.service';
import { AUTH_OPTIONS, IAuthConfig, AuthConfig } from './auth.config';

@NgModule({
    imports: [
        CookieModule
    ]
})
export class AuthModule {

    static forRoot(options?: IAuthConfig): ModuleWithProviders {
        return {
            ngModule: AuthModule,
            providers: [
                { provide: AUTH_OPTIONS, useValue: options },
                AuthConfig,
                AuthService,
                AuthGuard
            ]
        };
    }

}
