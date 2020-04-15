import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Optional,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { AuthService } from '@uni/common';
import { SchoolMenu } from '../../models/school-menu.model';
import { SchoolMenuService } from '../../services/school-menu.service';
import { Observable, Subscription, throwError, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'school-menus',
  templateUrl: './school-menus.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchoolMenusComponent implements OnInit, AfterViewInit, OnDestroy {

  currentSchool: SchoolMenu;
  schoolMenuItems = [];
  display$: Observable<boolean>;

  private _componentSubscription = new Subscription();

  constructor(
    protected cdr: ChangeDetectorRef,
    protected authService: AuthService,
    @Optional() protected schoolMenuService: SchoolMenuService
  ) { }

  ngOnInit() {
    if (!this.schoolMenuService) { return; }
    this.display$ = this.schoolMenuService.getDisplayControlStream();
  }

  ngAfterViewInit(): void {
    if (!this.schoolMenuService) { return; }
    const currentSchoolSubscription = this.schoolMenuService.currentMenuItem$.subscribe((currentSchool) => {
      this.currentSchool = currentSchool;
      this.cdr.detectChanges();
    });
    this._componentSubscription.add(currentSchoolSubscription);
    const reloadSubscription = this.authService.getAuthSubject().pipe(
      mergeMap((loginedSignal) =>
        loginedSignal ?
          this.schoolMenuService.getMenuItemsStream() :
          throwError(new Error('无法获得校区视图的选项列表'))
      )
    ).subscribe(
      (schoolMenuItems) => {
        this.schoolMenuItems = schoolMenuItems;
        this.cdr.detectChanges();
      },
      (e) => {
        console.warn(e.message || '无法获得校区视图的选项列表');
        this.schoolMenuItems = [];
        this.schoolMenuService.clear();
        this.display$ = of(false);
        this.cdr.detectChanges();
      }
    );
    this._componentSubscription.add(reloadSubscription);
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  compareWith = (o1: SchoolMenu, o2: SchoolMenu) => {
    if (!o1 || !o2) { return false; }
    return o1.id === o2.id;
  }

  /**
   * 当校区菜单项被选中时执行
   * @param _ 事件
   * @param schoolMenu 校区菜单项
   */
  handleMenuItemClick(_: Event, schoolMenu: SchoolMenu) {
    this.schoolMenuService.change(schoolMenu);
  }

}
