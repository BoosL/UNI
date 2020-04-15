import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  forwardRef,
  Injector,
  Renderer2,
  ComponentFactoryResolver,
  ChangeDetectorRef
} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd';
import {
  IBackendPageComponent,
  BACKEND_PAGE,
  SchoolMenuService
} from '@uni/core';
import {
  MarketingCustomerService,
  MarketingCustomer,
  CustomerConsultingRecordService,
  CustomerConsultingRecordModel,
} from '@uni/customer';
import {Subscription, BehaviorSubject, of} from 'rxjs';
import {map, filter, distinctUntilChanged, tap, mergeMap, delay, switchMap} from 'rxjs/operators';
import {INgxExcelDataSource, NgxExcelColumnType, NgxExcelComponentService, NgxExcelModelColumnRules} from 'ngx-excel';

@Component({
  selector: 'backend-page.customer-consulting-record-page',
  templateUrl: './customer-consulting-record-page.component.html',
  providers: [
    { provide: BACKEND_PAGE, useExisting: forwardRef(() => CustomerConsultingRecordPageComponent) },
    { provide: INgxExcelDataSource, useExisting: CustomerConsultingRecordService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerConsultingRecordPageComponent extends IBackendPageComponent implements OnInit , OnDestroy {

  customer$ = new BehaviorSubject<MarketingCustomer>(null);
  consultingRecord: CustomerConsultingRecordModel;
  rules: NgxExcelModelColumnRules<CustomerConsultingRecordModel>;
  loading = false;


  // tslint:disable: variable-name
  private _currentSchoolId = '';
  private _customer: MarketingCustomer;
  private _componentSubscription = new Subscription();

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected renderer2: Renderer2,
    protected injector: Injector,
    protected cfr: ComponentFactoryResolver,
    protected message: NzMessageService,
    protected schoolMenuService: SchoolMenuService,
    protected customerService: MarketingCustomerService,
    protected consultingRecordService: CustomerConsultingRecordService,
    protected changeDetectorRef: ChangeDetectorRef,
  ) {
    super(renderer2, injector, cfr);
  }

  ngOnInit() {
    this._currentSchoolId = this.schoolMenuService.currentSchool.id;
    // 当切换校区且不为不限制(-1)时跳转回列表
    const currentSchoolChangeSubscription = this.schoolMenuService.currentSchool$.pipe(
      map((currentSchool) => currentSchool.id),
      filter((currentSchoolId) => currentSchoolId !== '-1' && currentSchoolId !== this._currentSchoolId)
    ).subscribe(
      () => this._goback()
    );
    this._componentSubscription.add(currentSchoolChangeSubscription);
    const reloadSubscription = this.activatedRoute.params.pipe(
      map((params) => params.customerId),
      distinctUntilChanged(),
      map((customerId) => ({ customerId, schoolId: this._currentSchoolId })),
      tap(() => this.message.loading('数据加载中，请稍候...')),
      mergeMap(({ customerId, schoolId }) => this.customerService.getModel(customerId, { schoolId })),
      tap(() => this.message.remove())
    ).subscribe(
      (customer) => {
        this._customer = customer;
        this.customer$.next(customer);
      },
      (e) => this.message.error(e.message || '系统错误，请联系管理员')
    );
    this._componentSubscription.add(reloadSubscription);
    this.rules = this.consultingRecordService.getRules();
    const _rules = this.customerService.getRules();
    // tslint:disable: no-string-literal
    this.rules['isInvalidation'] = {
      label: '是否废turn', columnType: NgxExcelColumnType.Bool
    };
    this.rules = Object.assign({}, this.rules, _rules);
    this.consultingRecord = this.consultingRecordService.createModel();
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }
  public handleCustomerChange(customer: MarketingCustomer) {
    this._customer = Object.assign({id: this._customer.id}, customer);
  }
  public handleConsultingRecordChange(consultingRecord: CustomerConsultingRecordModel) {
    this.consultingRecord = consultingRecord;
  }

  public confirm(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.message.loading('咨询记录提交中...', {
      nzDuration: 0
    });
    of(null).pipe(
      tap(() => this.loading = true),
      delay(200),
      map(() => {
        const payload = Object.assign({}, this.consultingRecord);
        // tslint:disable: no-string-literal
        payload['recordIds'] = this.consultingRecord.attachments ?
          this.consultingRecord.attachments.map((attachment) => attachment.url) : [];
        delete payload['attachments'];
        payload['customer_id'] = this._customer.id;
        payload['mobile'] = this._customer.phone;
        payload['parents_mobile'] = this._customer.phoneParents;
        payload['backup_mobile'] = this._customer.phoneBackup;
        payload['chinese_name'] = this._customer.nameCn;
        payload['english_name'] = this._customer.nameEn;
        payload['capacity'] = this._customer.capacity ? this._customer.capacity.value : '';
        payload['grade'] = this._customer.grade ? this._customer.grade.value : '';
        payload['learning_purpose'] = this._customer.learningPurpose ?  this._customer.learningPurpose.value : '';
        payload['level'] = this._customer.level ? this._customer.level.value : '';
        payload['age'] = this._customer.age;
        return payload;
      }),
      switchMap((payload) => this.consultingRecordService.save(payload))
    ).subscribe(
      (record) => {
        this.loading = false;
        this.message.remove();
        this.message.success( '咨询记录提交成功,即将返回列表...');
        this._goback();
      },
      ({ message }) => {
        this.loading = false;
        this.message.remove();
        this.message.error(message || '系统错误，请联系管理员');
        this.changeDetectorRef.markForCheck();
      }
    );
  }
  public cancel(e: Event) {
    this.consultingRecord = null;
    this._goback();
  }

  private _goback() {
    window.history.back();
  }

}
