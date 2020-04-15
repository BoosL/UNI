import {
  Component,
  ChangeDetectionStrategy,
  Renderer2,
  Injector,
  ComponentFactoryResolver,
  Optional, forwardRef, ChangeDetectorRef
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService, NzDrawerService, NzModalService } from 'ng-zorro-antd';
import { INgxExcelDataSource } from 'ngx-excel';
import {
  SchoolMenuService,
  BACKEND_PAGE,
  School,
  EmployeeMenuService
} from '@uni/core';
import { TmkCustomersService } from '../../services/tmk-customers.service';
import { TmkCustomersMigrateComponent } from '../tmk-customers-migrate/tmk-customers-migrate.component';
import { TmkCustomersSearchService } from '../../services/tmk-customers-search.service';
import { TmkCustomersSearchComponent } from '../tmk-customers-search/tmk-customers-search.component';
import {BaseCustomersPageComponent} from '../base-customers-page-component';
import {TmkCustomersSearch} from '../../models/tmk-customers-search.model';
import {BehaviorSubject} from 'rxjs';
import {snakeCase} from 'change-case';

@Component({
  selector: 'backend-page.customers-page',
  templateUrl: './tmk-customers-page.component.html',
  providers: [
    { provide: BACKEND_PAGE, useExisting: forwardRef(() => TmkCustomersPageComponent) },
    { provide: INgxExcelDataSource, useExisting: TmkCustomersService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmkCustomersPageComponent extends  BaseCustomersPageComponent {
  public migrateSuccess$ = new BehaviorSubject<boolean>(false);
  // tslint:disable: variable-name
  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected renderer2: Renderer2,
    protected injector: Injector,
    protected cfr: ComponentFactoryResolver,
    protected message: NzMessageService,
    protected modal: NzModalService,
    protected drawer: NzDrawerService,
    protected schoolMenuService: SchoolMenuService,
    protected employeeMenuService: EmployeeMenuService,
    protected customerService: TmkCustomersService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected tmkSearchService: TmkCustomersSearchService
  ) {
    super(router, activatedRoute, renderer2, injector, cfr, message, schoolMenuService, employeeMenuService, changeDetectorRef);
  }
  /*
* 状态变化
* */
  public handleTagsChange(type: string) {
    if (this._tag && this._tag === type) {
      this.router.navigate(['.', {}], { relativeTo: this.activatedRoute });
    } else {
      this.router.navigate(['.', {tag: snakeCase(type)}], { relativeTo: this.activatedRoute });
    }

  }
  /*
* 客户搜索
* */
  public handleSearchButtonClick(e: any) {
    if (!this._searchConditions) {
      this._searchConditions = this.tmkSearchService.createModel() as TmkCustomersSearch;
      const school = this.schoolMenuService.currentSchool as School;
      this._searchConditions.school = school && school.id !== '-1' ? school : null;
    }
    this.modal.create({
      nzWidth: '75%',
      nzBodyStyle: { padding: '0' },
      nzContent: TmkCustomersSearchComponent,
      nzComponentParams: { context: this._searchConditions }
    }).afterClose.subscribe((searchConditions) => {
      // 返回 undefined 代表直接关闭
      if (searchConditions === undefined) {
        return;
      }
      this._searchConditions = searchConditions;
      this._reloadCustomers();
    });
  }

  protected _reloadCustomers() {
    const currentSchool = this.schoolMenuService.currentSchool;
    const schoolId = currentSchool && currentSchool.id !== '-1' ? currentSchool.id : '';
    const extraFilters = Object.assign(
      {},
      { groupFilter: this._tag || '', campus_id: schoolId, subordinate_staff_id: this._subordinateStaffId },
      this._searchConditions ? this.tmkSearchService.getConditions(this._searchConditions) : {}
    );
    this.extraFilters$.next(extraFilters);
  }
  /*
  * 资源转移
  * */
  handleTransformButtonClick(e: any) {
    this.modal.create({
      nzWidth: '600',
      nzBodyStyle: { padding: '0' },
      nzContent: TmkCustomersMigrateComponent,
      nzComponentParams: { customers: this._selectCustomers, extraFilters$: this.extraFilters$ }
    }).afterClose.subscribe((context) => {
      // 返回 undefined 代表直接关闭
      if (context === undefined) {
        return;
      }
      this.migrateSuccess$.next(true);
      this._reloadCustomers();
    });
  }
  public followSuccess() {
    this.migrateSuccess$.next(true);
    this._reloadCustomers();
  }
}
