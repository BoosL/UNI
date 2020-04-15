import {
  Component,
  ViewChild,
  Input,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import {
  INgxExcelDataSource,
} from 'ngx-excel';
import {Observable, Subscription} from 'rxjs';
import {filter, map, distinctUntilChanged} from 'rxjs/operators';
import {NzDrawerService, NzMessageService} from 'ng-zorro-antd';
import {Student} from '@uni/core';
import {ContractDto, ContractDeferComponent, ContractsComponent} from '@uni/contract';
import {StudentContractService} from '../../../../service/students/student-contract.service';

@Component({
  selector: 'student-contracts',
  templateUrl: './student-contracts.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: StudentContractService},
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentContractsComponent implements OnInit, AfterViewInit, OnDestroy {
  public schemeConfig = {
    height: 250
  };
  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();
  private _studentId = '';

  @Input() student$: Observable<Student>;
  @ViewChild(ContractsComponent, { static: false }) contractsComponent: ContractsComponent;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected drawer: NzDrawerService,
    protected message: NzMessageService,
    protected studentContractService: StudentContractService
  ) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    const studentSubscription = this.student$.pipe(
      filter((student) => !!student),
      map((student) => student.id),
      distinctUntilChanged()
    ).subscribe((studentId) => {
      this._studentId = studentId;
      this._reloadContracts();
    });
    this._componentSubscription.add(studentSubscription);
  }

  handleContractDefer(_contract: ContractDto) {
    this.drawer.create({
      nzWidth: 480,
      nzBodyStyle: { padding: '0' },
      nzContent: ContractDeferComponent,
      nzContentParams: { contract: _contract }
    }).afterClose.subscribe(((contracts: ContractDto[]) => {
        if (contracts === null || contracts === undefined) {
          return;
        }
        this.handleContractDeferCallback(contracts);
      })
    );
  }

  /**
   * 合同充值回调
   * @param contracts 合同模型
   */
  protected handleContractDeferCallback(contracts: ContractDto[]) {
    if (!this.contractsComponent) {
      return;
    }
    this.contractsComponent.excelComponent.handleChangedContexts([
      { action: 'updated', contexts: contracts }
    ]);
  }

  handleContractDelete(contract: ContractDto) {
    this.studentContractService.batchDestroy(
      Object.assign({}, { studentId: this._studentId, contractId: contract.id }),
    ).subscribe((contracts: ContractDto[]) => {
        this._reloadContracts();
      },
      (err) => {
        this.message.error(err.message || '系统错误，请联系管理员');
      }
    );
  }

  protected _reloadContracts() {
    if (!this.contractsComponent) {
      return;
    }
    const extraFilters = Object.assign(
      {},
      { student_id: this._studentId },
    );
    this.contractsComponent.excelComponent.bindFilters(extraFilters).reload();
  }

  handleActionButtonClick({ action, contract }) {
    if (this[action] === null || this[action] === undefined) {
      this.message.error(`未定义的动作 ${action}`);
      return;
    }
    this[action](contract);
  }


}
