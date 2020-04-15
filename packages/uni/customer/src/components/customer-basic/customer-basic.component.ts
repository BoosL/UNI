import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { INgxExcelDataSource, NgxExcelModelColumnRules, NgxExcelComponentService, NgxExcelContextComponent } from 'ngx-excel';
import { MarketingCustomer } from '../../models/marketing-customer.model';
import { MarketingCustomerService} from '../../services/marketing-customer/marketing-customer.service';
import { CustomerBasicComponentService } from './customer-basic-component.service';
import { Observable, Subscription } from 'rxjs';
import { tap, filter } from 'rxjs/operators';

@Component({
  selector: 'customer-basic',
  templateUrl: './customer-basic.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: MarketingCustomerService },
    { provide: NgxExcelComponentService, useClass: CustomerBasicComponentService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerBasicComponent implements OnInit, OnDestroy {

  rules: NgxExcelModelColumnRules<MarketingCustomer>;
  handledCustomer$: Observable<MarketingCustomer>;
  customer: MarketingCustomer;
  cantEditGrade = true;
  cantEditPhoneParents = true;
  cantEditPhoneBackup = true;

  // tslint:disable: variable-name
  private _readonly = false;
  private _componentSubscription = new Subscription();

  @Input() customer$: Observable<MarketingCustomer>;
  @Input() attachSelectTo: NgxExcelContextComponent;
  @Input()
  set readonly(value: boolean) { this._readonly = value === false ? false : true; }
  get readonly(): boolean { return this._readonly; }
  @Output() customerChange = new EventEmitter<MarketingCustomer>();

  @ViewChild(NgxExcelContextComponent, { static: false }) protected excelContextComponent: NgxExcelContextComponent;

  constructor(
    protected componentService: NgxExcelComponentService,
    protected customerService: MarketingCustomerService,
    protected changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.rules = this.customerService.getRules();

    const componentService = this.componentService as CustomerBasicComponentService;
    this.handledCustomer$ = this.customer$.pipe(
      filter((customer) => !!customer),
      tap((customer) => {
        this.cantEditPhoneParents = !!customer.phoneParents;
        this.cantEditPhoneBackup = !!customer.phoneBackup;
        componentService.initial(customer);
      })
    );

    const cantEditGradeSubscription = componentService.canEditGrade$.subscribe(
      (signal) => this.cantEditGrade = !signal
    );
    this._componentSubscription.add(cantEditGradeSubscription);
    this.handledCustomer$.subscribe( (customer) => {
      this.customer = customer;
      this.changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  handleContextChange(customer: MarketingCustomer) {
    const names = [
      'phone', 'phoneParents', 'phoneBackup',
      'nameCn', 'nameEn', 'age', 'gender',
      'capacity', 'grade', 'learningPurpose', 'level'
    ];
    const object: MarketingCustomer = {} as MarketingCustomer;
    names.forEach((name) => object[name] = customer[name]);
    this.customerChange.emit(object);
  }

  /**
   * 获得当前附着的 NgxExcelContext 组件
   */
  public get attachedContextComponent(): NgxExcelContextComponent {
    return this.attachSelectTo || this.excelContextComponent;
  }

}
