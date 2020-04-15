import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core';
import {
  INgxExcelDataSource,
  NgxExcelComponentService,
  NgxExcelModelColumnRules,
  NgxExcelContextComponent
} from 'ngx-excel';
import {CurriculumScheduleModel} from '../../models/curriculum-schedule.model';
import {Observable} from 'rxjs';
import {CurriculumSchedulesEditMinorComponentService} from '../../services/curriculum-schedules-edit-minor-component.service';
import {CurriculumSchedulesEditMinorDataService} from '../../services/curriculum-schedules-edit-minor-data.service';

@Component({
  selector: 'curriculum-schedules-edit-minor',
  templateUrl: './curriculum-schedules-edit-minor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CurriculumSchedulesEditMinorDataService,
    { provide: INgxExcelDataSource, useExisting: CurriculumSchedulesEditMinorDataService },
    { provide: NgxExcelComponentService, useClass: CurriculumSchedulesEditMinorComponentService }
  ],
})
export class CurriculumSchedulesEditMinorComponent implements OnInit {
  public rules: NgxExcelModelColumnRules<CurriculumScheduleModel>;
  // tslint:disable: variable-name
  @Input() schoolResourceClassroomIds;
  @Input() componentValueSubject: Observable<CurriculumScheduleModel>;
  @Input() attachSelectTo: NgxExcelContextComponent;
  @Output() handleChange = new EventEmitter<CurriculumScheduleModel>();

  constructor(
    protected excel: CurriculumSchedulesEditMinorDataService,
  ) {
  }

  ngOnInit() {
    this.rules = this.excel.getRules();
    this.excel.setResourceClassroom(this.schoolResourceClassroomIds);
  }

  public handleMinorChange(event: CurriculumScheduleModel) {
    this.handleChange.emit(event);
  }

}
