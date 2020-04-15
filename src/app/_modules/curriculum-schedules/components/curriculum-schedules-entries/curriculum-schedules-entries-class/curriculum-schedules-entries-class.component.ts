import {
  ChangeDetectionStrategy,
  Component,
  AfterViewInit, Renderer2, ElementRef
} from '@angular/core';
import {INgxExcelDataSource, NgxExcelComponentService} from 'ngx-excel';
import {RelativeEntity} from '../../../models/curriculum-schedule.model';
import {distinctUntilChanged} from 'rxjs/operators';
import {CurriculumSchedulesEntriesClassDataService} from '../../../services/entries/curriculum-schedules-entries-class-data.service';
import {
  CurriculumSchedulesEntriesClassComponentService
} from '../../../services/entries/curriculum-schedules-entries-class-component.service';
import {CurriculumSchedulesEntriesBaseComponent} from '../curriculum-schedules-entries-base.component';

@Component({
  selector: 'curriculum-schedules-entries-class',
  templateUrl: './curriculum-schedules-entries-class.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CurriculumSchedulesEntriesClassDataService,
    { provide: INgxExcelDataSource, useExisting: CurriculumSchedulesEntriesClassDataService },
    { provide: NgxExcelComponentService, useClass: CurriculumSchedulesEntriesClassComponentService }
  ],
})
export class CurriculumSchedulesEntriesClassComponent extends CurriculumSchedulesEntriesBaseComponent implements AfterViewInit {

  constructor(
    protected excel: CurriculumSchedulesEntriesClassDataService,
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
    this.handleAppendRelativeEntity.emit('smallClass');
  }
  public removeBlock() {
    super.removeBlock('smallClass');
  }
}
