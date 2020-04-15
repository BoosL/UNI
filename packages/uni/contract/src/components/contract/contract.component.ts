import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import {INgxExcelDataSource, NgxExcelComponentService, NgxExcelModelColumnRules} from 'ngx-excel';
import {of, BehaviorSubject} from 'rxjs';
import {delay, map, switchMap, tap} from 'rxjs/operators';
import {NzDrawerRef, NzMessageService} from 'ng-zorro-antd';
import {ContractDto} from '../../models/contract-dto.model';
import {ContractDtoService} from '../../services/contract-dto.service';
import {ContractRecharge} from '../../models/contract-recharge.model';
import {ContractRechargeService} from '../../services/contract-recharge.service';
import {ContractComponentService} from './contract-component.service';
import {ProductSubject} from '@uni/core';

@Component({
  selector: 'contract',
  templateUrl: './contract.component.html',
  providers: [
    ContractRechargeService,
    ContractComponentService,
    { provide: INgxExcelDataSource, useExisting: ContractRechargeService },
    { provide: NgxExcelComponentService, useClass: ContractComponentService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractComponent implements OnInit {
  loading = false;
  message: string;
  rechargeRules: NgxExcelModelColumnRules<ContractRecharge>;
  rules: NgxExcelModelColumnRules<ContractDto>;
  relativeContext: ContractRecharge;
  extendCells: any[][] ;
  contractDetail: ContractDto;
  contractSubjects$ = new BehaviorSubject<ProductSubject[]>( []);
  @Input() contractId: string;
  @Input() columnRules: [];

  constructor(
    protected drawerRef: NzDrawerRef,
    protected cdr: ChangeDetectorRef,
    protected contractService: ContractDtoService,
    protected contractRechargeService: ContractRechargeService,
    protected componentService: ContractComponentService
  ) {
  }

  ngOnInit() {
    (this.componentService as ContractComponentService).initCanEdit(this.columnRules);
    this.rechargeRules = this.contractRechargeService.getRules();
    this.rules = this.contractService.getRules();
    // tslint:disable: no-string-literal
    this.rules['productType'] = this.rules.relativeSubjects.relativeService.getRules().relativeProduct.relativeService.getRules().type;
    this.extendCells = this._slice(this.columnRules, 3);
    this.contractService.getModel(this.contractId).subscribe(
      (context: ContractDto) => {
        this.contractDetail = context;
        this.contractSubjects$.next(this.contractDetail.relativeSubjects);
        this.relativeContext = this.contractRechargeService.getRelativeContract(context, this.columnRules);
        this.cdr.detectChanges();
      }
    );

  }

  confirm(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    of(null).pipe(
      tap(() => this.loading = true),
      delay(200),
      map(() => {
        const payload = this.contractRechargeService.getValue(Object.assign({}, this.relativeContext));
        return payload;
      }),
      switchMap((payload) => this.contractService.batchUpdate(payload)),
    ).subscribe(
      (record) => {
        this.drawerRef.close(record);
      },
      ({ message }) => {
        this.loading = false;
        this.message = message || '系统错误，请联系管理员';
        this.cdr.markForCheck();
      }
    );
  }

  dismiss(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.drawerRef.close();
  }

  private _slice(list: any[], length: number): any[][] {
    const result: any[][] = [];
    for (let i = 0, len: number = list.length; i < len; i += length) {
      result.push(list.slice(i, i + length));
    }
    return result;
  }

}
