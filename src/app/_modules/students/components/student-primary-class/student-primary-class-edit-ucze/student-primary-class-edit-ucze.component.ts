import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  ViewChild,
  Input,
  OnChanges,
  AfterViewInit,
} from '@angular/core';
import {
  INgxExcelDataSource,
  NgxExcelModelColumnRules,
  NgxExcelComponent,
  NgxExcelComponentService,
} from 'ngx-excel';
import { now } from 'moment';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';
// tslint:disable:max-line-length
import {
  StudentsClass
} from '@uni/student';
import { StudentPrimaryClassEditUczeDataService } from './student-primary-class-edit-ucze-data.service';
import { StudnetPrimaryClassEditUczeComponentService } from './student-primary-class-edit-ucze-component.service';




@Component({
  selector: 'student-primary-class-edit-ucze',
  templateUrl: './student-primary-class-edit-ucze.component.html',
  providers: [
    StudentPrimaryClassEditUczeDataService,
    { provide: INgxExcelDataSource, useExisting: StudentPrimaryClassEditUczeDataService },
    { provide: NgxExcelComponentService, useClass: StudnetPrimaryClassEditUczeComponentService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentPrimaryClassEditUczeComponent implements OnInit, AfterViewInit {

  rules: NgxExcelModelColumnRules<StudentsClass>;

  public studentsValue: StudentsClass[] = [];
  // tslint:disable: variable-name
  private _schoolId: string;

  @Input() schoolId$: Observable<string>;
  @Output() handleChange = new EventEmitter<StudentsClass[]>();
  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

  constructor(
    protected excel: StudentPrimaryClassEditUczeDataService,
    protected message: NzMessageService,
    protected componentService: NgxExcelComponentService,
  ) { }

  ngOnInit() {
    this.rules = this.excel.getRules();
  }
  ngAfterViewInit(): void {
    this.schoolId$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe(
      (schoolId) => {
        if (this._schoolId && this._schoolId !== schoolId && this.studentsValue.length > 0) {
          this.studentsValue.splice(0, this.studentsValue.length);
          this.excelComponent.reload();
          this.handleChange.emit(this.studentsValue);
        }
        this._schoolId = schoolId;
      }
    );
  }

  dataSetChange(event) {
    this.studentsValue = event;
    this.handleChange.emit(this.studentsValue);
  }

  appendStudent = () => {
    if (this._schoolId === undefined) {
      return false;
    } else {
      const student = this.excel.createModel({
        id: now().toString()
      });
      // tslint:disable: no-string-literal
      student['relativeSchoolId'] = this._schoolId;
      this.studentsValue.push(student);
      this.excelComponent.reload();
      this.handleChange.emit(this.studentsValue);
    }
  }

  /**
   * @param model 待删除的分项
   */
  deleteStudent = ({ context }: { context: StudentsClass }) => {
    const index = this.studentsValue.findIndex( (item) => item.id === context.id);
    this.studentsValue.splice(index, 1);
    this.excelComponent.reload();
    this.handleChange.emit(this.studentsValue);
  }









}
