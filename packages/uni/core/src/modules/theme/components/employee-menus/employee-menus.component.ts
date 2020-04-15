import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  Optional,
  AfterViewInit
} from '@angular/core';
import { AuthService } from '@uni/common';
import { EmployeeMenu } from '../../models/employee-menu.model';
import { EmployeeMenuService } from '../../services/employee-menu.service';
import { Subscription, Observable, throwError, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'employee-menus',
  templateUrl: './employee-menus.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeMenusComponent implements OnInit, AfterViewInit, OnDestroy {

  // currentEmployeeMenu$: Observable<EmployeeMenu>;
  currentEmployeeMenu: EmployeeMenu;
  employeeMenuItems: EmployeeMenu[] = [];
  display$: Observable<boolean>;

  private _componentSubscription = new Subscription();

  constructor(
    protected cdr: ChangeDetectorRef,
    protected authService: AuthService,
    @Optional() protected employeeMenuService: EmployeeMenuService
  ) { }

  ngOnInit() {
    if (!this.employeeMenuService) { return; }
    // this.currentEmployeeMenu$ = this.employeeMenuService.currentEmployeeMenu$;
    this.display$ = this.employeeMenuService.getDisplayControlStream();
  }

  ngAfterViewInit() {
    if (!this.employeeMenuService) { return; }
    const currentEmployeeMenuSubscription = this.employeeMenuService.currentEmployeeMenu$.subscribe((currentEmployeeMenu) => {
      this.currentEmployeeMenu = currentEmployeeMenu;
      this.cdr.detectChanges();
    });
    this._componentSubscription.add(currentEmployeeMenuSubscription);

    const reloadSubscription = this.authService.getAuthSubject().pipe(
      mergeMap((loginedSignal) =>
        loginedSignal ?
          this.employeeMenuService.getMenuItemsStream() :
          throwError(new Error('无法获得下属员工视图的选项列表'))
      )
    ).subscribe(
      (employeeMenuItems) => {
        this.employeeMenuItems = employeeMenuItems;
        this.cdr.detectChanges();
      },
      (e) => {
        console.warn(e.message || '无法获得下属员工视图的选项列表');
        this.employeeMenuItems = [];
        this.employeeMenuService.clear();
        this.display$ = of(false);
        this.cdr.detectChanges();
      }
    );
    this._componentSubscription.add(reloadSubscription);
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  compareWith = (o1: EmployeeMenu, o2: EmployeeMenu) => {
    if (!o1 || !o2) { return false; }
    return o1.id === o2.id;
  }

  /**
   * 当校区菜单项被选中时执行
   * @param _ 事件
   * @param schoolMenu 校区菜单项
   */
  handleMenuItemClick(_: Event, employeeMenu: EmployeeMenu) {
    this.employeeMenuService.change(employeeMenu);
  }

}
