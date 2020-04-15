import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  TemplateRef,
  QueryList,
  ContentChildren,
  Input,
  Type,
  ComponentRef,
  Output,
  EventEmitter,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { LayoutBlockDirective } from '../directives/layout-block.directive';
import { collapseMotion } from 'ng-zorro-antd';

export interface LayoutMenu {
  name: string;
  label: string;
  active: boolean;
  component: Type<any>;
}

@Component({
  selector: 'div.layout-sub',
  template: `
    <div class="block match-parent">
      <portlet [title]="title" [icon]="icon" [noPadding]="!title">
        <ng-template portletBody>
          <ng-template *ngFor="let blockTpl of blockTpls" [ngTemplateOutlet]="blockTpl"></ng-template>
          <ul *ngIf="layoutMenus.length > 0" class="nav nav-aside">
            <li *ngFor="let layoutMenu of layoutMenus">
              <a matRipple href="javascript:;" [class.active]="layoutMenu.active" (click)="handleMenuClick(layoutMenu)">
                {{ layoutMenu.label }}
              </a>
            </li>
          </ul>
        </ng-template>
      </portlet>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutSubComponent implements OnInit, AfterViewInit {

  @Input() title: string;
  @Input() icon: string;
  @Input() layoutMenus: LayoutMenu[] = [];
  @Output() layoutMenuClick = new EventEmitter<LayoutMenu>();
  @ContentChildren(LayoutBlockDirective, { read: TemplateRef, descendants: true }) blockTpls: QueryList<TemplateRef<any>>;

  constructor(
    protected cdr: ChangeDetectorRef
  ) { }

  ngOnInit() { }

  ngAfterViewInit() {
    const activedMenu = this.layoutMenus.find((layoutMenu) => layoutMenu.active) ||
      (this.layoutMenus.length > 0 ? this.layoutMenus[0] : null);
    if (!activedMenu) { return; }
    this.handleMenuClick(activedMenu);
  }

  /**
   * 当菜单被点击时执行
   * @param layoutMenu 被点击的菜单
   */
  handleMenuClick(layoutMenu: LayoutMenu) {
    this.layoutMenus.forEach((menu) => {
      if (menu.name === layoutMenu.name) { return; }
      menu.active = false;
    });
    this.layoutMenuClick.emit(layoutMenu);
  }

  /**
   * 手动触发页面刷新
   */
  detectChanges() {
    this.cdr.detectChanges();
  }

}
