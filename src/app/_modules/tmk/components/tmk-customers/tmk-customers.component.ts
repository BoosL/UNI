import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Renderer2,
  Injector,
  ComponentFactoryResolver,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter, Optional
} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {NzMessageService, NzDrawerService, NzModalService} from 'ng-zorro-antd';
import {INgxExcelDataSource, NgxExcelComponent} from 'ngx-excel';
import {
  CustomerComponent,
  CustomersSearchService
} from '@uni/customer';
import {Observable, of, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {TmkCustomersService} from '../../services/tmk-customers.service';
import {TmkCustomer} from '../../models/tmk-customer.model';
import {TmkCustomerFollowRecordService} from '../../services/tmk-customer-follow-record.service';
import {TmkCustomerFollowRecordEditComponent} from '../tmk-customer-follow-recode-edit/tmk-customer-follow-record-edit.component';
import {TmkCustomersMigrateService} from '../../services/tmk-customers-migrate.service';
import {TmkCustomerComponent} from '../tmk-customer/tmk-customer.component';

@Component({
  selector: 'tmk-customers',
  templateUrl: './tmk-customers.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: TmkCustomersService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmkCustomersComponent implements OnInit, OnDestroy, AfterViewInit {

  // tslint:disable: variable-name
  private _selectCustomers: TmkCustomer[];
  private _componentSubscription = new Subscription();
  private _filters: any;
  @Input() extraFilters$: Observable<any>;
  @Input() isPool;
  @Output() handleChangeSelect = new EventEmitter<TmkCustomer[]>();
  @Output() followSuccess = new EventEmitter();
  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected renderer2: Renderer2,
    protected injector: Injector,
    protected cfr: ComponentFactoryResolver,
    protected message: NzMessageService,
    protected modal: NzModalService,
    protected drawer: NzDrawerService,
    protected customerService: TmkCustomersService,
    protected tmkFollowRecordService: TmkCustomerFollowRecordService,
    protected tmkCustomersMigrateService: TmkCustomersMigrateService,
    @Optional() protected searchService: CustomersSearchService
  ) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    const subject = this.extraFilters$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap( (filters) => this._filters = filters)
    ).subscribe(() => {
      this._reloadCustomers();
    });
    this._componentSubscription.add(subject);
  }

  private _reloadCustomers() {
    if (!this.excelComponent) {
      return;
    }
    this._selectCustomers = [];
    this.excelComponent.bindFilters(this._filters).reload();
    this.handleChangeSelect.emit(this._selectCustomers);
  }

  /*
  * 更改行选择
  * */
  public handleChangeSelectRow(bool: boolean, context: TmkCustomer) {
    this._selectCustomers = this._selectCustomers || [];
    if (bool) {
      if (this._selectCustomers.indexOf(context) < 0) {
        this._selectCustomers.push(context);
      }
    } else {
      const index = this._selectCustomers.indexOf(context);
      if (index > -1) {
        this._selectCustomers.splice(index, 1);
      }
    }
    this.handleChangeSelect.emit(this._selectCustomers);
  }

  public detail = ({ context }) => {
    if (!context || !context.id) {
      return;
    }
    this.drawer.create({
      nzWidth: '90%',
      nzBodyStyle: { padding: '0' },
      nzContent: TmkCustomerComponent,
      nzContentParams: { customerId$: of(context.id), componentMode: 'portlet' }
    }).afterClose.subscribe((customer) => {
      if (customer === null || customer === undefined) {
        return;
      }
      if ( typeof (customer) === 'boolean' && customer) {
        this._reloadCustomers();
        this.followSuccess.emit();
        return;
      }
      this.router.navigate(['/customers', customer.id]);
    });
  }
/*  /!**
   * 新增跟进记录的回调
   * @param customer 客户模型
   *!/
  protected appendFollowRecordCallback(customer: TmkCustomer
  ) {
    if (!this.excelComponent) {
      return;
    }
    this.excelComponent.handleChangedContexts([
      { action: 'updated', context: customer }
    ]);
  }*/

  /**
   * 还原TMK
   */
  public recoverTmk = ({ context }) => {
    this.tmkCustomersMigrateService.save({
      action: 'resource_assigned',
      from_tmk: '',
      target_tmk: context.tmk ? context.tmk.id : '',
      customers: [context.id]
    }).subscribe(
      (customers) => {
        this._reloadCustomers();
      },
      (err) => {
        this.message.error(err.message || '系统错误，请联系管理员');
      }
    );
  }
}
