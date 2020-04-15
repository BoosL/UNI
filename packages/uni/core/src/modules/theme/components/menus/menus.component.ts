import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService } from '@uni/common';
import { Menu } from '../../models/menu.model';
import { MenuService } from '../../services/menu.service';
import { Observable, of } from 'rxjs';
import { mergeMap, filter } from 'rxjs/operators';

@Component({
  selector: 'backend-menus',
  templateUrl: './menus.component.html',
  animations: [
    trigger('fadeInOut', [
      state('collapse', style({ opacity: 0, height: '0' })),
      state('expand', style({ opacity: 1, height: '*' })),
      transition('collapse <=> expand', animate('200ms ease'))
    ])
  ]
})

export class BackendMenusComponent implements OnInit {

  readonly menus$: Observable<Menu[]> = this.authService.getAuthSubject().pipe(
    mergeMap((success) => success ? this.menuService.getList() : of([]))
  );

  private _currentRouterUrl = '';
  private _expandedMenu: Menu = undefined;

  constructor(
    protected router: Router,
    protected authService: AuthService,
    protected menuService: MenuService
  ) { }

  ngOnInit() {
    this._currentRouterUrl = this.router.url.split(/[?#]/)[0];
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this._currentRouterUrl = this.router.url.split(/[?#]/)[0]);
  }

  /**
   * 获得菜单项的样式
   * @param menu 菜单项或菜单地址
   */
  getMenuCssClasses(menu: Menu | string) {
    let classes = '';
    if (typeof (menu) === 'string') {
      if (this._isActivedMenu(menu)) {
        classes += ' active';
      }
    } else {
      if (this._isActivedMenu(menu)) {
        classes += 'active';
      }
      if (menu.children.length > 0) {
        classes += this._isExpandedMenu(menu) ? ' expand' : '';
      }
    }
    return classes;
  }

  /**
   * 反转折叠子菜单
   * @param menu 父菜单
   */
  toggleMenu(menu: Menu) {
    if (menu.children.length === 0) {
      return;
    }
    this._expandedMenu = this._expandedMenu === menu ? null : menu;
  }

  isExpandedMenu(menu: Menu): boolean {
    return this._isExpandedMenu(menu);
  }

  /**
   * 返回旧版
   */
  rollback() {
    const protocol = location.protocol;
    const host = location.host;
    location.href = `${protocol}//${host}`;
  }

  /**
   * 判断菜单是否当前活跃菜单
   * @param menu 待判断的菜单项
   */
  private _isActivedMenu(menu: Menu | string): boolean {
    if (typeof (menu) === 'string' || menu.children.length === 0) {
      const url = typeof (menu) === 'string' ? menu : menu.url;
      const params = typeof (menu) === 'string' ? {} : menu.params || {};

      if (url.startsWith('http://') || url.startsWith('https://')) {
        return false;
      }

      return this._currentRouterUrl === this.router.createUrlTree([url, params]).toString();
    }

    return menu.children.some((child) => this._isActivedMenu(child));
  }

  /**
   * 判断菜单是否当前展开状态
   * @param menu 带判断的菜单项
   */
  private _isExpandedMenu(menu: Menu): boolean {
    if (menu.children.length === 0) {
      return false;
    }
    return (this._expandedMenu === undefined && this._isActivedMenu(menu)) ||
      (this._expandedMenu === menu || menu.children.some((child) => this._expandedMenu === child));
  }

}
