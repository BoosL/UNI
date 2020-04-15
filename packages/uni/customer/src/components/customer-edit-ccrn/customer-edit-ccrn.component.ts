import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { INgxExcelDataSource, NgxExcelModelColumnRules, NgxExcelComponentService, NgxExcelContextComponent } from 'ngx-excel';
import { MarketingCustomer, MarketingCustomerCcrn} from '../../models/marketing-customer.model';
import { MarketingCustomerService} from '../../services/marketing-customer/marketing-customer.service';
import { MarketingCustomerEditCcrnComponentService } from './marketing-customer-edit-ccrn-component.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'customer-edit-ccrn',
  templateUrl: './customer-edit-ccrn.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: MarketingCustomerService },
    { provide: NgxExcelComponentService, useClass: MarketingCustomerEditCcrnComponentService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerEditCcrnComponent implements OnInit, OnDestroy {

  visible: boolean;
  invisibleDeposit: boolean;
  cantEditDeposit: boolean;
  invisibleCc: boolean;
  cantEditCc: boolean;
  invisibleCd: boolean;
  cantEditCd: boolean;
  context: Partial<MarketingCustomer>;
  rules: NgxExcelModelColumnRules<MarketingCustomer>;

  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();
  private _ccrn: MarketingCustomerCcrn[];

  @Input() ccrn$: Observable<MarketingCustomerCcrn[]>;
  @Input() ccrnInfo: Partial<MarketingCustomer>;
  @Input() attachSelectTo: NgxExcelContextComponent;
  @Output() ccrnInfoChange = new EventEmitter<Partial<MarketingCustomer>>();

  constructor(
    protected cdr: ChangeDetectorRef,
    protected componentService: NgxExcelComponentService,
    protected customerService: MarketingCustomerService
  ) { }

  ngOnInit() {
    this.rules = this.customerService.getRules();
    const reloadSubscription = this.ccrn$.subscribe(
      (ccrn) => {
        const ccrnInfo = this.ccrnInfo || this.customerService.createModel();
        this.context = {
          school: ccrnInfo.school,
          hasDeposit: ccrnInfo.hasDeposit,
          cc: ccrnInfo.cc,
          cd: ccrnInfo.cd,
          nextStep: ''
        } as Partial<MarketingCustomer>;
        this._ccrn = ccrn;
        this._reload();
      }
    );
    this._componentSubscription.add(reloadSubscription);
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  handleContextChange(context: Partial<MarketingCustomer>) {
    this.cantEditCc = !(this.componentService as MarketingCustomerEditCcrnComponentService).canEditCc(context);
    this.cantEditCd = !(this.componentService as MarketingCustomerEditCcrnComponentService).canEditCd(context);
    Object.keys(this.context).forEach((contextKey) => this.ccrnInfo[contextKey] = this.context[contextKey]);
    this.ccrnInfoChange.emit(this.ccrnInfo);
  }

  private _reload() {
    if (!this._ccrn || this._ccrn.length === 0) {
      this.visible = false;
      this.cdr.detectChanges();
      return;
    }

    const { componentConfig, defaultValue } =
      (this.componentService as MarketingCustomerEditCcrnComponentService).bindCcrnConfig(this._ccrn);

    Object.keys(componentConfig).forEach((configKey) => this[configKey] = componentConfig[configKey]);
    this.context = Object.assign(this.context, defaultValue);
    this.visible = !this.invisibleDeposit || !this.invisibleCc || !this.invisibleCd;
    this.handleContextChange(this.context);
    this.cdr.detectChanges();
  }

}
