import {
  ChangeDetectionStrategy,
  Component,
  AfterViewInit, Renderer2, ElementRef
} from '@angular/core';
import {INgxExcelDataSource, NgxExcelComponentService, } from 'ngx-excel';
import {RelativeEntity} from '../../../models/curriculum-schedule.model';
import {distinctUntilChanged} from 'rxjs/operators';
import {
  CurriculumSchedulesEntriesCustomerDataService
} from '../../../services/entries/curriculum-schedules-entries-customer-data.service';
import {
  CurriculumSchedulesEntriesCustomerComponentService
} from '../../../services/entries/curriculum-schedules-entries-customer-component.service';
import {CurriculumSchedulesEntriesBaseComponent} from '../curriculum-schedules-entries-base.component';

@Component({
  selector: 'curriculum-schedules-entries-customer',
  templateUrl: './curriculum-schedules-entries-customer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CurriculumSchedulesEntriesCustomerDataService,
    { provide: INgxExcelDataSource, useExisting: CurriculumSchedulesEntriesCustomerDataService },
    { provide: NgxExcelComponentService, useClass: CurriculumSchedulesEntriesCustomerComponentService }
  ],
})
export class CurriculumSchedulesEntriesCustomerComponent extends CurriculumSchedulesEntriesBaseComponent implements AfterViewInit {

  constructor(
    protected excel: CurriculumSchedulesEntriesCustomerDataService,
    protected renderer2: Renderer2,
    protected el: ElementRef
  ) {
    super(renderer2, el);
  }
  ngAfterViewInit() {
    this._componentSubscription.add(this.entriesSubject.pipe(
      distinctUntilChanged()
      ).subscribe((entries: RelativeEntity[]) => {
        if (entries && entries.length !== this._oldRelativeEntry) {
          this.excel.bindDataSet(entries);
          this.excelComponent.reload();
          this._oldRelativeEntry = entries.length;
        }
      })
    );
  }
  /**
   * 新增排课实体
   */
  public appendRelativeEntity = () => {
    this.handleAppendRelativeEntity.emit('customer');
  }

  public removeBlock() {
    super.removeBlock('customer');
  }
}
