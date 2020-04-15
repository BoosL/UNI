import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  AfterViewInit, Renderer2, ElementRef
} from '@angular/core';
import {INgxExcelDataSource, NgxExcelComponentService} from 'ngx-excel';
import {RelativeEntity} from '../../../models/curriculum-schedule.model';
import {
  CurriculumSchedulesEntriesStudentDataService
} from '../../../services/entries/curriculum-schedules-entries-student-data.service';
import {
  CurriculumSchedulesEntriesStudentComponentService
} from '../../../services/entries/curriculum-schedules-entries-student-component.service';
import {distinctUntilChanged} from 'rxjs/operators';
import {EntryStudentModel} from '../../../models/entry-student.model';
import {CurriculumSchedulesEntriesBaseComponent} from '../curriculum-schedules-entries-base.component';

@Component({
  selector: 'curriculum-schedules-entries-student',
  templateUrl: './curriculum-schedules-entries-student.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CurriculumSchedulesEntriesStudentDataService,
    { provide: INgxExcelDataSource, useExisting: CurriculumSchedulesEntriesStudentDataService },
    { provide: NgxExcelComponentService, useClass: CurriculumSchedulesEntriesStudentComponentService }
  ],
})
export class CurriculumSchedulesEntriesStudentComponent extends CurriculumSchedulesEntriesBaseComponent implements  OnInit, AfterViewInit {

  constructor(
    protected excel: CurriculumSchedulesEntriesStudentDataService,
    protected renderer2: Renderer2,
    protected el: ElementRef
  ) {
    super(renderer2, el);
  }
  ngOnInit() {
    this.excel.setRules(this.rules);
  }
  ngAfterViewInit() {
    this._componentSubscription.add(this.entriesSubject.pipe(
      distinctUntilChanged()
      ).subscribe((entries: RelativeEntity[]) => {
      // tslint:disable: no-string-literal
        if (entries && entries.length !== this._oldRelativeEntry) {
          this.excel.bindDataSet(entries);
          this.excelComponent.reload();
          this._oldRelativeEntry = entries.length;
          this.excelComponent.rebuildUi();
        }
      })
    );
  }
  /**
   * 新增排课实体
   */
  public appendRelativeEntity = () => {
    this.handleAppendRelativeEntity.emit('student');
  }
  public removeBlock() {
    super.removeBlock('student');
  }
}
