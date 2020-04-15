import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild, OnDestroy, AfterViewInit, Output, EventEmitter, ComponentRef } from '@angular/core';
import { INgxExcelDataSource, NgxExcelComponent, NgxExcelContextChangeRecord } from 'ngx-excel';
import { ProductSubject, SelectOption } from '@uni/core';
import { CurriculumTableRow, CurriculumTableColumn } from './curriculum-table-data.model';
import { CurriculumTableDataService } from './curriculum-table-data.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'curriculum-table',
  templateUrl: './curriculum-table.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: CurriculumTableDataService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurriculumTableComponent<T extends ProductSubject> implements OnInit, AfterViewInit, OnDestroy {

  tableRows: CurriculumTableRow[];
  tableColumns: { [name: string]: CurriculumTableColumn };
  extraColumns: CurriculumTableColumn[];

  // tslint:disable: variable-name
  private _readonly = false;
  private _componentSubscription = new Subscription();

  @Input() columns: CurriculumTableColumn[];
  @Input() productSubjects$: Observable<T[]>;
  @Input()
  set readonly(value: boolean) { this._readonly = value === false ? false : true; }
  get readonly(): boolean { return this._readonly; }
  @Output() componentReady = new EventEmitter<CurriculumTableComponent<T>>();
  @ViewChild(NgxExcelComponent, { static: false }) protected excelComponent: NgxExcelComponent;

  constructor(
    protected dataService: CurriculumTableDataService
  ) { }

  ngOnInit() {
    this.tableRows = [];
    this.tableColumns = {};
    this.extraColumns = [];
    const rules = this.dataService.getRules();
    // tslint:disable: no-string-literal
    this.tableColumns['type'] = { label: '产品类型', template: null };
    this.tableColumns['selectedProduct'] = { label: rules.selectedProduct.label, template: null };
    this.tableColumns['selectedSubject'] = { label: rules.selectedSubject.label, template: null };
    this.tableColumns['curriculumCount'] = { label: rules.curriculumCount.label, template: null };
    if (!this.columns) { return; }
    this.columns.forEach((column) => {
      if (!column.name) { return; }
      if (Object.keys(this.tableColumns).indexOf(column.name) >= 0) {
        this.tableColumns[column.name] = Object.assign({}, this.tableColumns[column.name], column);
      } else {
        this.extraColumns.push(column);
      }
    });
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    if (!this.productSubjects$) { return; }
    const productSubjectsStream = this.productSubjects$.subscribe((productSubjects) => {
      const tableRowsMap: { [name: string]: CurriculumTableRow } = {};
      productSubjects.forEach((productSubject) => {
        const tableRow = this.dataService.createModelFromProductSubject(productSubject);
        // tslint:disable-next-line: max-line-length
        if (tableRow.isEtpProductType) {
          const mapKey = tableRow.selectedProduct.type.value + '-' + tableRow.selectedProduct.id;
          if (!tableRowsMap[mapKey]) {
            tableRowsMap[mapKey] = tableRow;
            tableRowsMap[mapKey].curriculumCount = tableRow.selectedProduct.curriculumCount;
          }
        } else {
          const mapKey = tableRow.selectedProduct.type.value + '-' + tableRow.selectedSubject.id;
          if (!tableRowsMap[mapKey]) {
            tableRowsMap[mapKey] = tableRow;
          }
        }
      });
      this.tableRows.splice(0, this.tableRows.length, ...Object.values(tableRowsMap));
      this.excelComponent.reload();
    });
    this._componentSubscription.add(productSubjectsStream);
    this.componentReady.emit(this);
  }

  public handleCurriculumRowsChange(records: NgxExcelContextChangeRecord[]) {
    if (!this.excelComponent) { return; }
    const curriculumRowsChangeRecords = records.map((record) => {
      if (record.context) {
        record.context = this.dataService.createModelFromProductSubject(record.context);
      }
      if (record.contexts) {
        record.contexts = record.contexts.map((context) => this.dataService.createModelFromProductSubject(context));
      }
      if (record.relativeContext) {
        record.relativeContext = this.dataService.createModelFromProductSubject(record.relativeContext);
      }
      return record;
    });
    this.excelComponent.handleContextChange(curriculumRowsChangeRecords);
  }

}
