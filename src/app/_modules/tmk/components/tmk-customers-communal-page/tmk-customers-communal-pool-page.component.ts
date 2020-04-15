import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  forwardRef,
  ViewChild,
  Renderer2,
  ComponentFactoryResolver,
  Injector,
  Optional, OnInit, OnDestroy,
} from '@angular/core';
import {
  SchoolMenuService,
  BACKEND_PAGE,
  School,
  EmployeeMenuService
} from '@uni/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzDrawerService, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { INgxExcelDataSource, NgxExcelComponent } from 'ngx-excel';
import { TmkCustomersPublicService } from '../../services/tmk-customers-public.service';
import { TmkCustomersCommunalSearchComponent } from '../tmk-customers-communal-search/tmk-customers-communal-search.component';
import { TmkCustomersCommunalMigrateComponent } from '../tmk-customers-communal-migrate/tmk-customers-communal-migrate.component';
import { TmkCustomersService } from '../../services/tmk-customers.service';
import {BaseCustomersPageComponent} from '../base-customers-page-component';
import {TmkCustomersSearchService} from '../../services/tmk-customers-search.service';
import {TmkCustomersSearch} from '../../models/tmk-customers-search.model';



@Component({
  selector: 'backend-page.tmk-customers-communal-pool-page',
  templateUrl: './tmk-customers-communal-pool-page.component.html',
  providers: [
    { provide: BACKEND_PAGE, useExisting: forwardRef(() => TmkCustomersCommunalPageComponent) },
    { provide: INgxExcelDataSource, useExisting: TmkCustomersPublicService },
    { provide: TmkCustomersService, useClass: TmkCustomersPublicService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmkCustomersCommunalPageComponent extends  BaseCustomersPageComponent implements OnInit, OnDestroy {
  // tslint:disable: variable-name

  @ViewChild(NgxExcelComponent, { static: false }) private excelComponent: NgxExcelComponent;

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
    protected tmkCustomerSearchService: TmkCustomersSearchService,
  ) {
    super(router, activatedRoute, renderer2, injector, cfr, message, schoolMenuService, employeeMenuService, changeDetectorRef);
  }
  ngOnInit() {
    super.ngOnInit();
    this.employeeMenuService.hide();
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this.employeeMenuService.show();
  }

  /*
* 客户搜索
* */
  public handleSearchButtonClick(e: any) {
    if (!this._searchConditions) {
      this._searchConditions = this.tmkCustomerSearchService.createModel() as TmkCustomersSearch;
      const school = this.schoolMenuService.currentSchool as School;
      this._searchConditions.school = school && school.id !== '-1' ? school : null;
    }
    this.modal.create({
      nzWidth: '75%',
      nzBodyStyle: { padding: '0' },
      nzContent: TmkCustomersCommunalSearchComponent,
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
      { groupFilter: this._tag || '', campus_id: schoolId, },
      this._searchConditions ? this.tmkCustomerSearchService.getConditions(this._searchConditions) : {}
    );
    this.extraFilters$.next(extraFilters);
  }
  /*
 * 分配资源管理
 * */
  handleAllocationButtonClick(e: any) {
    this.modal.create({
      nzWidth: '600',
      nzBodyStyle: { padding: '0' },
      nzContent: TmkCustomersCommunalMigrateComponent,
      nzComponentParams: { customers: this._selectCustomers, extraFilters$: this.extraFilters$ }
    }).afterClose.subscribe((context) => {
      // 返回 undefined 代表直接关闭
      if (context === undefined) { return; }
      this._reloadCustomers();
    });
  }
}
