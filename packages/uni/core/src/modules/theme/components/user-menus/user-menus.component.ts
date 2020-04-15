import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@uni/common';
import { EmployeeService, Employee } from '../../../../logic/logic';
import { BACKEND_CONFIG, IBackendConfig } from '../../../../backend.config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'user-menus',
  templateUrl: './user-menus.component.html'
})

export class UserMenusComponent implements OnInit {

  visible = false;

  readonly currentUser$: Observable<Employee> = this.authService.getAuthSubject().pipe(
    map((logined) => logined ? this.employeeService.createModel(null, this.authService.getCurrentUser()) : null)
  );

  constructor(
    protected router: Router,
    protected authService: AuthService,
    protected employeeService: EmployeeService,
    @Inject(BACKEND_CONFIG) public appConfig: IBackendConfig
  ) { }

  ngOnInit() { }

  navigateTo(e: Event, target: 'profile' | 'schedules' | 'rollback' | 'login') {
    e.stopPropagation();
    e.preventDefault();
    this._hideMenus();

    switch (target) {
      case 'profile': {
        this._hideMenus();
        this.router.navigate(['/profile']);
        return;
      }

      case 'schedules': {
        this._hideMenus();
        this.router.navigate(['/schedule']);
        return;
      }

      case 'login': {
        this.router.navigate(['/login']);
        return;
      }

      case 'rollback': {
        const protocol = location.protocol;
        const host = location.host;
        location.href = `${protocol}//${host}/`;
        return;
      }
    }
  }

  logout(e: Event) {
    this.authService.logout().subscribe(() => this.navigateTo(e, 'login'));
  }

  private _hideMenus() {
    this.visible = false;
  }
}
