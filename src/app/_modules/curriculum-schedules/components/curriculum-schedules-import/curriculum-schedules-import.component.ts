import { Component, OnInit, ChangeDetectionStrategy, Input, Optional, ChangeDetectorRef } from '@angular/core';
import {INgxExcelDataSource, NgxExcelModelColumnRules} from 'ngx-excel';
import {of} from 'rxjs';
import {delay, mergeMap} from 'rxjs/operators';
import { NzModalRef, NzDrawerRef } from 'ng-zorro-antd';
import {CurriculumSchedulesImportExportService} from '../../_services/curriculum-schedules-import-export.service';
import {CurriculumSchedulesImportExport} from '../../models/curriculum-schedules-import-export.model';

@Component({
  selector: 'curriculum-schedules-search.curriculum-schedules-search',
  templateUrl: './curriculum-schedules-import.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: CurriculumSchedulesImportExportService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurriculumSchedulesImportComponent implements OnInit {
  rules: NgxExcelModelColumnRules<CurriculumSchedulesImportExport>;
  message: string;
  public loading = false;
  @Input() context: CurriculumSchedulesImportExport;
  constructor(
    protected changeDetectorRef: ChangeDetectorRef,
    protected importService: CurriculumSchedulesImportExportService,
    @Optional() public drawerRef: NzDrawerRef,
  ) {
  }
  ngOnInit() {
    this.rules = this.importService.getRules();
    this.context = this.context || this.importService.createModel() as CurriculumSchedulesImportExport;
  }

  confirm(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.loading = true;
    of(null).pipe(
      delay(200),
      mergeMap( () => {
        return   this.importService.importCurriculumSchedules(this.context);
      })
    ).subscribe(() => {
      this.loading = false;
      this.drawerRef.close(this.context);
    }, (err) => {
      this.loading = false;
      this.message = err.message || '系统错误，请联系管理员';
      this.changeDetectorRef.markForCheck();
    });
  }
  dismiss(event) {
    if (this.drawerRef) {
      this.drawerRef.close();
    }
  }
}
