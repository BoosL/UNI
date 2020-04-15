import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  ViewChild
} from '@angular/core';
import {
  INgxExcelDataSource,
  NgxExcelModelColumnRules,
  NgxExcelComponent,
  NgxExcelComponentService,
} from 'ngx-excel';
import { now } from 'moment';
import { Subscription, BehaviorSubject } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';
import { StudentAchievementEditSubentryDataService } from '../student-achievement-check-subentry/student-achievement-subentry-data.service';
import { StudentSubjects } from '../../../../models/student-achievements.model';
import { StudnetAchievementEditSubentryComponentService } from './student-achievement-edit-subentry-component.service';


@Component({
  selector: 'student-achievement-edit-subentry',
  templateUrl: './student-achievement-edit-subentry.component.html',
  providers: [
    StudentAchievementEditSubentryDataService,
    { provide: INgxExcelDataSource, useExisting: StudentAchievementEditSubentryDataService },
    { provide: NgxExcelComponentService, useClass: StudnetAchievementEditSubentryComponentService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentAchievementEditSubentryComponent implements OnInit {

  rules: NgxExcelModelColumnRules<StudentSubjects>;

  private _componentValue: StudentSubjects[];

  @Output() handleChange = new EventEmitter<StudentSubjects[]>();
  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

  constructor(
    protected excel: StudentAchievementEditSubentryDataService,
    protected message: NzMessageService,
    protected componentService: NgxExcelComponentService,
  ) { }

  ngOnInit() {
    this.rules = this.excel.getRules();
    (this.componentService as StudnetAchievementEditSubentryComponentService).ccrnCurrentConfig$.subscribe((res) => {
      const last = this._componentValue.length - 1;
      this._componentValue[last].name = res.name;
      this._componentValue[last].fraction = res.fraction;
      this._componentValue[last].remark = res.remark;
      this.handleChange.emit(this._componentValue);
    });
  }


  /**
   * 新增分项列表
   *
   */
  protected create() {
    this._componentValue.push(this.excel.createModel({
      id: now().toString()
    }));
  }

  protected bind() {
    this.excel.bindDataSet(this._componentValue);
    this.excelComponent.reload();
  }



  addRelativeEntity = () => {
    if (!this._componentValue) {
      this._componentValue = [];
    }
    const lastvalue = this._componentValue.length - 1;
    if (!this._componentValue.length) {
      this.create();
    } else {
      // tslint:disable: max-line-length
      if ((this._componentValue[lastvalue].name === '' && this._componentValue[lastvalue].fraction === '') || (this._componentValue[lastvalue].name === '' && this._componentValue[lastvalue].fraction !== '') || (this._componentValue[lastvalue].name !== '' && this._componentValue[lastvalue].fraction === '')) {
        return false;
      } else {
        this.create();
      }
    }
    this.bind();
  }



  /**
   * @param model 待删除的分项
   */
  deleteEntity = ({ context }: { context: StudentSubjects }) => {
    if (this._componentValue && this._componentValue.length > 0) {
      for (const item of this._componentValue) {
        if (item.id === context.id) {
          this._componentValue.splice(this._componentValue.indexOf(item), 1);
        }
      }
    }
    this.bind();
  }


}
