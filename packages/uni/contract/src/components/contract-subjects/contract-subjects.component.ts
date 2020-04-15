import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import {INgxExcelDataSource, NgxExcelComponent} from 'ngx-excel';
import {ContractSubjectsDataService} from './contract-subjects-data.service';
import {Observable, Subscription} from 'rxjs';
import {ProductSubject} from '@uni/core';

@Component({
  selector: 'contract-subjects',
  templateUrl: './contract-subjects.component.html',
  providers: [
    ContractSubjectsDataService,
    { provide: INgxExcelDataSource, useExisting: ContractSubjectsDataService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractSubjectsComponent implements AfterViewInit, OnDestroy {
  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();
  @Input() contractSubjects$: Observable<ProductSubject[]>;
  @ViewChild(NgxExcelComponent, { static: false }) protected excelComponent: NgxExcelComponent;

  constructor(
    protected excel: ContractSubjectsDataService,
  ) {
  }

  ngAfterViewInit(): void {
    this._componentSubscription.add(this.contractSubjects$.subscribe(
      (subjects: ProductSubject[]) => {
        if (subjects && subjects.length > 0) {
          this.excel.bindDataSet(subjects);
          this.excelComponent.reload();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this._componentSubscription.unsubscribe();
  }
}
