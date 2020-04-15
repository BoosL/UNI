import {
  Component,
  OnInit, Output,
  ChangeDetectionStrategy, Input, AfterViewInit, ViewChild, EventEmitter, OnDestroy,
} from '@angular/core';
import {TeacherCurriculumSchedulesModel} from '../../model/teacher-curriculum-schedules.model';
import {INgxExcelDataSource, NgxExcelComponent, NgxExcelComponentService} from 'ngx-excel';
import {TeachingDiariesListDataService} from '../../services/teaching-diaries-list-data.service';
import {Observable, Subscription} from 'rxjs';
import {EntryStudentModel} from '../../../curriculum-schedules/models/entry-student.model';
import {TeachingDiariesListComponentService} from '../../services/teaching-diaries-list-component.service';
import {NzDrawerService, NzMessageService} from 'ng-zorro-antd';
import {filter} from 'rxjs/operators';
import {TeachingDiariesEditComponent} from '../teaching-diaries-edit/teaching-diaries-edit.component';
import {TeachingDiariesEntryService, TeachingDiariesService} from '../../_services/teaching-diaries.service';
import {TeachingDiaryModel} from '../../model/teaching-diary.model';

@Component({
  selector: 'teaching-diaries-list',
  templateUrl: './teaching-diaries-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: INgxExcelDataSource, useExisting: TeachingDiariesListDataService },
    { provide: NgxExcelComponentService, useClass: TeachingDiariesListComponentService }
  ]
})
export class TeachingDiariesListComponent implements OnInit, AfterViewInit, OnDestroy {
  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();
  @Input() schedulesSubject: Observable<TeacherCurriculumSchedulesModel[]>;
  @Output() handleChangeTeachingStatus = new EventEmitter<TeacherCurriculumSchedulesModel>();
  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

  constructor(
    protected excel: TeachingDiariesListDataService,
    protected teachingDiariesService: TeachingDiariesService,
    protected teachingEntryService: TeachingDiariesEntryService,
    protected drawer: NzDrawerService,
    protected message: NzMessageService
  ) {
  }

  /**
   * 编辑教学日志
   * @param context：排课数据
   */
  editDiary = ({ context }) => {
    this.message.loading('数据加载中，请稍候...');
    this.teachingDiariesService.getModel(context.id, { curriculumScheduleId: context.id }).subscribe((diaryModel: TeachingDiaryModel) => {
      this.message.remove();
      this._showDrawer(context, diaryModel);
    }, (e) => {
      this.message.remove();
      this.message.error(e.message || '系统错误，请联系管理员');
    });
  }
  /**
   * 新增教学日志
   * @param context：排课数据
   */
  addDiary = ({ context }) => {
    const diaryModel = this.teachingDiariesService.createModel({
      csId: context.id,
      taskExt: []
    });
    for (const item of context.classStudents) {
      diaryModel.taskExt.push(
        this.teachingEntryService.createModel(Object.assign(item))
      );
    }
    this._showDrawer(context, diaryModel);
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this._componentSubscription.add(this.schedulesSubject.subscribe((result: TeacherCurriculumSchedulesModel[]) => {
        this.excel.bindDataSet(result);
        this.excelComponent.reload();
      })
    );
  }

  ngOnDestroy(): void {
    this._componentSubscription.unsubscribe();
  }

  /**
   * 获取学员名单
   */
  public getEntries(data: EntryStudentModel[]) {
    const list = [];
    if (data && data.length > 0) {
      for (const item of data) {
        if (item.student) {
          list.push(item.student.name);
        }
      }
    }
    return list.join('，');
  }

  /**
   * 展示编辑框
   * @param context：排课数据, diaryModel:教务日志数据
   */
  private _showDrawer(context: TeacherCurriculumSchedulesModel, diaryModel: TeachingDiaryModel) {
    const drawerRef = this.drawer.create({
      nzWidth: '45%',
      nzBodyStyle: { height: '100%', overflow: 'auto', padding: '0 0 54px 0' },
      nzContent: TeachingDiariesEditComponent,
      nzContentParams: {
        schedule: Object.assign({}, context),
        componentValue: diaryModel
      }
    });
    drawerRef.afterClose.pipe(
      filter((schedule) => !!schedule)
    ).subscribe((schedule) => {
      console.log(context);
      this.handleChangeTeachingStatus.emit(context);
    });
  }
}
