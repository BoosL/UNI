import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  forwardRef,
  Renderer2,
  Injector,
  ComponentFactoryResolver,
  ViewChild,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { INgxExcelDataSource, NgxExcelComponent, NgxExcelDataService, NgxExcelComponentService } from 'ngx-excel';
import { IBackendPageComponent, BACKEND_PAGE, EmployeeMenuService, SchoolMenuService, CustomerSource } from '@uni/core';
import { TmkEmployeeConfig } from '../../models/tmk-employee.model';
import { TmkEmployeeConfigService } from '../../services/tmk-employee-config.service';
import { TmkEmployeesSearchService } from '../../services/tmk-employees-search.service';
import { TmkEmployeesSearch } from '../../models/tmk-employees-search.model';
import { TmkEmployeesSearchComponent } from '../tmk-employees-search/tmk-employees-search.component';
import { TmkEmployeeConfigDataService } from './tmk-employee-config-data.service';
import { TmkEmployeeConfigComponentService } from './tmk-employee-config-component.service';
import { TmkEmployeeSourcesManagerComponent } from '../tmk-employee-sources-manager/tmk-employee-sources-manager.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'backend-page.tmk-employees',
  templateUrl: './tmk-employees-page.component.html',
  providers: [
    TmkEmployeesSearchService,
    { provide: BACKEND_PAGE, useExisting: forwardRef(() => TmkEmployeesPageComponent) },
    { provide: INgxExcelDataSource, useClass: TmkEmployeeConfigDataService },
    { provide: NgxExcelComponentService, useClass: TmkEmployeeConfigComponentService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmkEmployeesPageComponent extends IBackendPageComponent implements OnInit, OnDestroy, AfterViewInit {

  // tslint:disable: variable-name
  private _searchConditions: TmkEmployeesSearch;
  private _componentSubscription = new Subscription();

  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

  constructor(
    protected renderer: Renderer2,
    protected injector: Injector,
    protected cfr: ComponentFactoryResolver,
    protected cdr: ChangeDetectorRef,
    protected message: NzMessageService,
    protected modal: NzModalService,
    protected schoolMenuService: SchoolMenuService,
    protected employeeMenuService: EmployeeMenuService,
    protected employeeConfigService: TmkEmployeeConfigService,
    protected searchService: TmkEmployeesSearchService,
    protected dataService: INgxExcelDataSource<TmkEmployeeConfig>,
    protected componentService: NgxExcelComponentService
  ) {
    super(renderer, injector, cfr);
  }

  ngOnInit() {
    this.schoolMenuService.hide();
    this.employeeMenuService.hide();
  }

  ngOnDestroy() {
    this.schoolMenuService.show();
    this.employeeMenuService.show();
    this._componentSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this._reloadEmployees();
  }

  /**
   * 当搜索按钮被点击时执行
   * @param e 事件
   */
  handleSearchButtonClick(e: Event) {
    e.stopPropagation();
    e.preventDefault();

    this.modal.create({
      nzWidth: 960,
      nzBodyStyle: { padding: '0' },
      nzContent: TmkEmployeesSearchComponent,
      nzComponentParams: { context: this._searchConditions }
    }).afterClose.subscribe((searchConditions) => {
      // 返回 undefined 代表直接关闭
      if (searchConditions === undefined) { return; }
      this._searchConditions = searchConditions;
      this._reloadEmployees();
    });
  }

  /**
   * 当 TMK渠道标签 列被点击时执行
   */
  handleRelativeSourcesColumnClick = (employeeConfig: TmkEmployeeConfig) => {
    if (!employeeConfig.accept) { return; }
    this.modal.create({
      nzWidth: '75%',
      nzBodyStyle: { padding: '0' },
      nzContent: TmkEmployeeSourcesManagerComponent,
      nzComponentParams: { employeeConfig }
    }).afterClose.subscribe((employeeSources: CustomerSource[]) => {
      if (!employeeSources) { return; }
      this.message.loading('正在绑定TMK渠道标签，请稍候...');
      const payload = {
        accept: employeeConfig.accept,
        sources: employeeSources.map((employeeSource) => employeeSource.id)
      };
      this.employeeConfigService.update(payload, employeeConfig.id).subscribe((context) => {
        this.message.remove();
        this.message.success('TMK渠道标签绑定成功');
        if (!this.excelComponent) { return; }
        this.excelComponent.handleChangedContexts([{ action: 'updated', context }]);
      }, (e) => {
        this.message.error(e.message || '系统错误，请联系管理员');
      });
    });
  }

  /**
   * 重新加载员工列表
   */
  private _reloadEmployees() {
    if (!this.excelComponent) { return; }
    const extraFilters = Object.assign(
      {},
      this._searchConditions ? this.searchService.getConditions(this._searchConditions) : {}
    );
    this.employeeConfigService.getList(extraFilters).subscribe((employeeConfigs) => {
      (this.dataService as NgxExcelDataService<TmkEmployeeConfig>).bindDataSet(employeeConfigs);
      this.excelComponent.reload();
    }, (e) => {
      this.message.error(e.message || '系统错误，请联系管理员');
    });
  }

}
