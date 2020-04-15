import {
  Component,
  OnInit,
  ChangeDetectionStrategy, Input, AfterViewInit,
} from '@angular/core';
import {INgxExcelDataSource, NgxExcelModelColumnRules} from 'ngx-excel';
import {TeachingDiariesService} from '../../_services/teaching-diaries.service';
import {TeachingDiaryEntry, TeachingDiaryModel} from '../../model/teaching-diary.model';
import {TeacherCurriculumSchedulesModel} from '../../model/teacher-curriculum-schedules.model';
import {NzDrawerRef} from 'ng-zorro-antd';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'teaching-diaries-edit',
  templateUrl: './teaching-diaries-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: INgxExcelDataSource, useExisting: TeachingDiariesService },
  ]
})
export class TeachingDiariesEditComponent implements OnInit, AfterViewInit {
  public rules: NgxExcelModelColumnRules<TeachingDiaryModel>;
  public loading: boolean;
  public message = '';
  public taskExtSubject = new BehaviorSubject<TeachingDiaryEntry[]>([]);
  @Input() schedule: TeacherCurriculumSchedulesModel;
  @Input() componentValue: TeachingDiaryModel;

  constructor(
    protected excel: TeachingDiariesService,
    protected drawRef: NzDrawerRef<TeachingDiaryModel>,
  ) {
  }

  ngOnInit() {
    this.rules = this.excel.getRules();
    this.taskExtSubject.next(this.componentValue.taskExt);
  }

  ngAfterViewInit(): void {
    (this.excel as TeachingDiariesService).getTaskSituationSubject().subscribe((entry: TeachingDiaryEntry) => {
      if (this.componentValue && this.componentValue.taskExt) {
        for (const item of this.componentValue.taskExt) {
          if (item.id === entry.id) {
            item.taskSituation = entry.taskSituation;
            return;
          }
        }
      }
    });
  }

  public dismiss() {
    this.drawRef.close();
  }
  /**
   * 确认教学日志
   */
  public confirm() {
    this.loading = true;
    const param = {
      curriculumScheduleId: this.schedule.id,
      schedule_id: this.schedule.id,
      task_ext: [],
      file_urls: []
    }
    if (this.componentValue.taskExt) {
      for (const item of this.componentValue.taskExt) {
        param.task_ext.push({
          id: item.id,
          student_name: item.student.name,
          task_situation: item.taskSituation.value
        });
      }
    }
    if (this.schedule.teachingUpdate) {
      this.excel.save(Object.assign({}, this.componentValue, param)).subscribe((res) => {
        this.loading = false;
        this.drawRef.close(res);
      }, (e) => {
        this.loading = false;
        this.message = e.message || '系统错误，请联系管理员';
      });
    }
    if (this.schedule.teachingInsert) {
      this.excel.update(Object.assign({}, this.componentValue, param), this.schedule.id).subscribe((res) => {
        this.loading = false;
        this.drawRef.close(res);
      }, (e) => {
        this.loading = false;
        this.message = e.message || '系统错误，请联系管理员';
      });
    }

  }
}
