import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    protected router: Router,
    protected authService: AuthService
  ) { }

  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.loginValid().pipe(
      tap((logined) => {
        if (logined) { return; }
        console.log(state);
        this.router.navigate([ '/login' ], { queryParams: { backUrl: state.url } });
      })
    ) as Observable<boolean>;
  }
}
