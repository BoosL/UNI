import {Component, OnInit, ChangeDetectionStrategy, Input, Optional, ChangeDetectorRef} from '@angular/core';
import {INgxExcelDataSource, NgxExcelModelColumnRules, NgxExcelComponentService} from 'ngx-excel';
import {NzModalRef, NzDrawerRef} from 'ng-zorro-antd';
import {of} from 'rxjs';
import {delay, mergeMap} from 'rxjs/operators';
import {CurriculumSchedulesAutoCoursesService} from '../../_services/curriculum-schedules-auto-courses.service';
import {AutoCourses} from '../../models/auto-courses';
import {CurriculumSchedulesAutoCoursesComponentService} from '../../services/curriculum-schedules-auto-courses-component.service';

@Component({
  selector: 'curriculum-schedules-auto-courses.curriculum-schedules-auto-courses',
  templateUrl: './curriculum-schedules-auto-courses.component.html',
  providers: [
    CurriculumSchedulesAutoCoursesComponentService,
    { provide: INgxExcelDataSource, useExisting: CurriculumSchedulesAutoCoursesService },
    { provide: NgxExcelComponentService, useClass: CurriculumSchedulesAutoCoursesComponentService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurriculumSchedulesAutoCoursesComponent implements OnInit {
  rules: NgxExcelModelColumnRules<AutoCourses>;
  message: string;
  public loading = false;
  @Input() context: AutoCourses;

  constructor(
    protected autoCoursesService: CurriculumSchedulesAutoCoursesService,
    protected componentService: CurriculumSchedulesAutoCoursesComponentService,
    protected changeDetectorRef: ChangeDetectorRef,
    @Optional() public modalRef: NzModalRef,
    @Optional() public drawerRef: NzDrawerRef,
  ) {
  }

  ngOnInit() {
    this.rules = this.autoCoursesService.getRules();
    this.rules.type.selectOptions = this.autoCoursesService.getAutoTypes();
    this.context = this.context || this.autoCoursesService.createModel() as AutoCourses;
  }

  confirm(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.loading = true;
    of(null).pipe(
      delay(200),
      mergeMap( () => {
        return   this.autoCoursesService.addAutoCourses(this.context);
      })
    ).subscribe(() => {
      this.loading = false;
      if (this.modalRef) {
        this.modalRef.close(this.context);
      }
      if (this.drawerRef) {
        this.drawerRef.close(this.context);
      }
    }, (err) => {
      this.loading = false;
      this.message = err.message || '系统错误，请联系管理员';
      this.changeDetectorRef.markForCheck();
    });
  }
  dismiss(event) {
    if (this.modalRef) {
      this.modalRef.close();
    }
    if (this.drawerRef) {
      this.drawerRef.close();
    }
  }
}
