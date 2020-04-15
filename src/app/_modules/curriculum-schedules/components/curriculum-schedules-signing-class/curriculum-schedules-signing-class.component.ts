import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  ChangeDetectorRef, ViewChild, OnInit, AfterViewInit, OnDestroy
} from '@angular/core';
import {
  INgxExcelDataSource, NgxExcelComponent, NgxExcelModelColumnRules,
} from 'ngx-excel';
import {
  ProductService
} from '@uni/core';
import {CurriculumScheduleModel} from '../../models/curriculum-schedule.model';
import {NzDrawerRef} from 'ng-zorro-antd';
import {EntryStudentModel} from '../../models/entry-student.model';
import {BehaviorSubject, Subscription} from 'rxjs';
import {EntryStudentService} from '../../_services/entry-student.service';
import {debounceTime, delay} from 'rxjs/operators';

@Component({
  selector: 'curriculum-schedules-signing-class',
  templateUrl: './curriculum-schedules-signing-class.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: INgxExcelDataSource, useExisting: EntryStudentService },
  ],
})
export class CurriculumSchedulesSigningClassComponent implements OnInit, AfterViewInit, OnDestroy {
  public rules: NgxExcelModelColumnRules<EntryStudentModel>;
  public entriesStudentSubject = new BehaviorSubject<EntryStudentModel[]>([]);
  public loading = false;
  public message = '';
  public confirmBtnIsAble = false;
  public uploadFile = {
    attachments: ''
  };

  // tslint:disable variable-name
  private _componentSubscription = new Subscription();
  @Input() schedule: CurriculumScheduleModel;
  @Output() handleUpdateSchedule = new EventEmitter<CurriculumScheduleModel>();
  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected excel: EntryStudentService,
    protected drawRef: NzDrawerRef<CurriculumScheduleModel>,
    protected productService: ProductService
  ) {

  }

  ngOnInit(): void {
    this.rules = this.excel.getRules();
    this.excel.setComponentValue(this.schedule);
  }

  ngAfterViewInit(): void {
    this._componentSubscription.add(this.excel.getAvailableEntryStudentsSubject().pipe(
      delay(200)
    ).subscribe((result: EntryStudentModel[]) => {
      this.entriesStudentSubject.next(result);
      this.confirmBtnIsAble = this.excel.confirmBtnIsAble();
      this.cdr.markForCheck();
    }));
  }
  ngOnDestroy(): void {
    this._componentSubscription.unsubscribe();
  }

  // 关闭抽屉
  public dismiss() {
    this.drawRef.close();
  }

  public confirm() {
    this.loading = true;
    this.excel.saveChange(this.uploadFile.attachments).pipe(
      delay(200),
    ).subscribe((result: CurriculumScheduleModel) => {
      this.loading = false;
      this.drawRef.close(result);
    }, (err) => {
      this.loading = false;
      this.message = err.message || '系统错误，请联系管理员';
      this.cdr.markForCheck();
    });
  }
}
