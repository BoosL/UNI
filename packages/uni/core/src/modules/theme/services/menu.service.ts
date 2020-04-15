import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelService, NgxExcelColumnType, NgxExcelModelColumnRules, NgxExcelHttpResponse } from 'ngx-excel';
import { BACKEND_CONFIG, IBackendConfig } from '../../../backend.config';
import { BackendService } from '../../../services/backend.service';
import { MenuGroup } from '../models/menu-group.model';
import { Menu, allMenus } from '../models/menu.model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import * as lodash from 'lodash';

@Injectable()
export class MenuService extends NgxExcelService<Menu> {

  protected resourceName = '';
  protected resourceUri = 'menus';
  protected rules: NgxExcelModelColumnRules<Menu> = {
    id: {
      label: '菜单主键',
      columnType: NgxExcelColumnType.PrimaryKey
    },
    label: {
      label: '菜单名称',
      columnType: NgxExcelColumnType.Text
    },
    icon: {
      label: '菜单图标',
      columnType: NgxExcelColumnType.Text
    },
    url: {
      label: '菜单链接',
      columnType: NgxExcelColumnType.Url
    },
    isLocal: {
      label: '是否本地地址',
      columnType: NgxExcelColumnType.Bool,
      default: false
    },
    apiUrl: {
      label: '后端接口地址',
      columnType: NgxExcelColumnType.Url
    },
    parentId: {
      label: '父菜单主键',
      columnType: NgxExcelColumnType.Number
    },
    parent: {
      label: '父菜单',
      columnType: NgxExcelColumnType.ForeignKey
    },
    children: {
      label: '子菜单',
      columnType: NgxExcelColumnType.MultiForeignKey
    },
    group: {
      label: '菜单组别',
      columnType: NgxExcelColumnType.MultiForeignKey
    }
  };

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    @Inject(BACKEND_CONFIG) protected config: IBackendConfig
  ) {
    super(httpClient, backendService);
  }

  /**
   * @inheritdoc
   */
  public getList(): Observable<any[]> {
    return of(allMenus).pipe(
      map((menus: Menu[]) => {
        const filteredMenus = lodash
          .filter(menus, (menu) => lodash.isNull(menu.apiUrl || null) ? true : this.backendService.can(menu.apiUrl))
          .map((menu) => {
            const url = lodash.isNull(menu.url || null) ? null : menu.url.startsWith('/') ? menu.url : `/${menu.url}`;
            const modules = menu.modules || [];
            if (modules.length === 0 || modules.indexOf(this.config.moduleName) >= 0) {
              menu.isLocal = true;
              menu.url = url;
            } else {
              menu.isLocal = false;
              if (!lodash.isString(url)) {
                menu.url = null;
              } else if (url.startsWith('http://') || url.startsWith('https://')) {
                menu.url = url;
              } else {
                menu.url = location.origin + `/${modules[0]}${url}`;
              }
            }
            return menu;
          });
        return this._buildMenuTree(filteredMenus);
        // return (new NgxExcelHttpResponse(null)).setCollection(this.resourceName, this._buildMenuTree(filteredMenus));
      })
    );
  }

  /**
   * 构建菜单树结构
   * @param menus 菜单列表
   */
  private _buildMenuTree(menus: Menu[]): MenuGroup[] {
    const menuGroups: { [name: string]: MenuGroup } = {};
    lodash.each(menus, (menu) => {
      const parentId = menu.parentId || '';
      if (!lodash.isEmpty(parentId)) { return; }

      const menuGroup = menu.group || null;
      if (lodash.isNull(menuGroup)) { return; }

      if (lodash.isNull(menu.url)) {
        const children = this._getChildrenMenus(menus, menu.id);
        if (children.length === 0) { return; }
        menu.children = children;
      } else {
        menu.children = [];
      }

      if (lodash.isUndefined(menuGroups[menuGroup.label])) {
        menuGroup.children = [];
        menuGroups[menuGroup.label] = menuGroup;
      }

      menuGroups[menuGroup.label].children.push(menu);
    });
    return lodash.values(menuGroups);
  }

  /**
   * 获得指定菜单的子菜单列表
   * @param menus 菜单列表
   * @param parentId 父菜单键
   */
  private _getChildrenMenus(menus: Menu[], parentId: string): Menu[] {
    return lodash.filter(menus, (menu) => {
      if (menu.parentId !== parentId) { return false; }
      const children = this._getChildrenMenus(menus, menu.id);
      if (lodash.isNull(menu.url) && children.length === 0) { return false; }
      menu.children = children;
      return true;
    });
  }

}
