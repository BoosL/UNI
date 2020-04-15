import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import {
  INgxExcelDataSource,
  NgxExcelComponentService,
} from 'ngx-excel';
import * as lodash from 'lodash';
import {CurriculumScheduleModel} from '../../models/curriculum-schedule.model';
import {NzDrawerRef} from 'ng-zorro-antd';
import {TeachingResourceModel} from '../../models/teaching-resource.model';
import {BehaviorSubject, of} from 'rxjs';
import {CurriculumSchedulesEditDataService} from '../../services/curriculum-schedules-edit-data.service';
import {CurriculumSchedulesEditComponentService} from '../../services/curriculum-schedules-edit-component.service';
import {mergeMap, map, debounceTime, delay} from 'rxjs/operators';
import {SelectOption, ProductService} from '@uni/core';
import {CurriculumSchedulesStateService} from '../../services/curriculum-schedules-state.service';

@Component({
  selector: 'curriculum-schedules-edit',
  templateUrl: './curriculum-schedules-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CurriculumSchedulesEditDataService,
    { provide: INgxExcelDataSource, useExisting: CurriculumSchedulesEditDataService },
    { provide: NgxExcelComponentService, useClass: CurriculumSchedulesEditComponentService }
  ],
})
export class CurriculumSchedulesEditComponent implements OnInit {
  public componentValue: CurriculumScheduleModel;
  public componentValueSubject = new BehaviorSubject<CurriculumScheduleModel>(null);
  public schoolResourceTeacherIds: string[];
  public schoolResourceClassroomIds: string[];
  public loading = false;
  public message = '';
  public btnIsNotAble = true;
  // tslint:disable: variable-name
  private _time: string;

  private _oldComponentValue: CurriculumScheduleModel;
  private _newComponentValue: CurriculumScheduleModel;

  @Input()
  set contextRow(value) {
    this._time = value ? value.datetime : '';
    this._setSchoolResourceData(value.schoolResource);
  }

  @Input() scheduleClassroom;

  @Input()
  set schedule(value) {
    this._oldComponentValue = value;
    this.componentValue = value ? lodash.cloneDeep(value) : null;
  }


  @Input() operateType;

  @Input() editType;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected excel: CurriculumSchedulesEditDataService,
    protected drawRef: NzDrawerRef<CurriculumScheduleModel>,
    protected productService: ProductService,
    protected dataService: CurriculumSchedulesStateService,
  ) {

  }

  ngOnInit() {
    this.componentValue = this.componentValue ? Object.assign(this.componentValue, { editType: this.editType }) :
      this.excel.createModel({
        time: this._time,
        school: this.dataService.getCurrentSchool(),
        classroom: this.scheduleClassroom ? this.scheduleClassroom : null,
        teachingType: this.excel.getDefaultCTypeSelectOptions()
      });
    this.componentValueSubject.next(this.componentValue);
    this.componentValueSubject.subscribe((res: CurriculumScheduleModel) => {
      this.btnIsNotAble = true;
      if (res && res.curriculum && res.teacher && res.teachingType) {
        if (this.operateType === 'multiple') {
          this.btnIsNotAble = false;
        } else {
          if (res.relativeEntries && res.relativeEntries.length > 0) {
            for (const item of res.relativeEntries) {
              if (item.relativeSchool && (item.student || item.customer || item.smallClass)) {
                this.btnIsNotAble = false;
              }
            }
          }
        }
      }
    });
  }

  /**
   * 解析当前排课时间对应不可用资源
   * @param res 校区不可用资源
   */
  private _setSchoolResourceData(res: TeachingResourceModel) {
    this.schoolResourceTeacherIds = [];
    this.schoolResourceClassroomIds = [];
    if (res) {
      if (res.teachers && res.teachers.length > 0) {
        for (const item of res.teachers) {
          this.schoolResourceTeacherIds.push(item.id.toString());
        }
      }
      if (res.classrooms && res.classrooms.length > 0) {
        for (const item of res.classrooms) {
          this.schoolResourceClassroomIds.push(item.id.toString());
        }
      }
    }
  }

  /**
   * 子组件排课数据更改
   * @param value 排课
   */
  public handleChange(value: CurriculumScheduleModel) {
    this.componentValue = value;
    this.componentValueSubject.next(this.componentValue);
  }

  // 关闭抽屉
  public dismiss() {
    this.drawRef.close();
  }

  /**
   * 确认保存
   * 排课id存在为修改，不存在为新增
   */
  public confirm() {
    if (this.componentValue) {
      this.loading = true;
      if (!this.componentValue.id) {
        this.excel.append(this.componentValue).pipe(
          delay(200)
        ).subscribe(
          (schedule) => this.drawRef.close(schedule),
          (e) => {
            this.loading = false;
            this.message = e.message || '系统错误，请联系管理员';
            this.cdr.markForCheck();
          }
        );
      } else {
        this._newComponentValue = lodash.cloneDeep(this._oldComponentValue);
        // tslint:disable: no-string-literal
        if (this.componentValue['editType']) {
          if (this.componentValue['editType'] === 'info') {
            // 编辑信息
            this._updateInfoSchedule();
          } else if (this.componentValue['editType'] === 'entry') {
            // 编辑上课名单
            this._updateEntrySchedule();
          }
        }

      }
    }
  }

  /**
   * 变更信息
   */
  private _updateInfoSchedule() {
    let obs = of(null).pipe(
      delay(200)
    );
    if (this.excel.classRoomIsChanged(this._oldComponentValue, this.componentValue)) {
      const param = Object.assign({
        school_id: this._oldComponentValue.school.id,
        action: 'allocateClassroom'
      }, this.componentValue);
      obs = this.excel.save(param, this._oldComponentValue.id.toString()).pipe(
        map((newRes: CurriculumScheduleModel) => {
          this._newComponentValue = newRes;
          return newRes;
        })
      );
    }
    if (this.excel.infoIsChanged(this._oldComponentValue, this.componentValue)) {
      obs = obs.pipe(
        mergeMap((res) => {
            const param = Object.assign({
              school_id: this._oldComponentValue.school.id,
              action: 'update'
            }, this.componentValue);
            return this.excel.save(param, this._oldComponentValue.id.toString());
          })
      );
    }
    obs.subscribe((res) => {
        // tslint:disable: no-string-literal
        if (res) {
          res['editType'] = this.editType;
        }
        this.drawRef.close(res);
      },
      (e) => {
        this.loading = false;
        this._newComponentValue['editType'] = this.editType;
        this.componentValueSubject.next(this._newComponentValue);
        this.excel.changeSchedule(this._newComponentValue);
        this.message = e.message || '系统错误，请联系管理员';
        this.cdr.markForCheck();
      });
  }

  /**
   * 变更实体
   */
  private _updateEntrySchedule() {
    const obs = this._updateDeleteRelativeEntry(this._oldComponentValue);
    obs.pipe(
      mergeMap((res) => {
        return this._updateAddRelativeEntry(res);
      })
    ).subscribe((res) => {
        // tslint:disable: no-string-literal
        res['editType'] = this.editType;
        this.drawRef.close(res);
      },
      (e) => {
        this.loading = false;
        this._newComponentValue['editType'] = this.editType;
        this.componentValueSubject.next(this._newComponentValue);
        this.excel.changeSchedule(this._newComponentValue);
        this.message = e.message || '系统错误，请联系管理员';
        this.cdr.markForCheck();
      });
  }

  /**
   * 保存更新排课新增实体
   */
  private _updateAddRelativeEntry(res: CurriculumScheduleModel) {
    if (this.componentValue.relativeEntries && this.componentValue.relativeEntries.length > 0) {
      const _oldRelativeEntries = res.relativeEntries;
      const _newRelativeEntries = this.componentValue.relativeEntries;
      const _relativeEntries = [];
      /*获取新增的实体*/
      if (!_oldRelativeEntries || (_oldRelativeEntries && _newRelativeEntries)) {
        for (const newitem of _newRelativeEntries) {
          let bool = false;
          for (const item of _oldRelativeEntries) {
            if ((item.student && newitem.student && item.student.id === newitem.student.id)
              || (item.customer && newitem.customer && item.customer.id === newitem.customer.id)) {
              bool = true;
              break;
            }
          }
          if (bool) {
            continue;
          }
          _relativeEntries.push(newitem);
        }
      }
      let obs = of(res);
      obs.pipe(
        delay(200),
      );
      if (_relativeEntries && _relativeEntries.length > 0) {
        for (const item of _relativeEntries) {
          const param = Object.assign({
            school_id: res.school.id,
            action: 'appendRelativeEntry',
            relative_entry: null
          }, res);
          if (item.student && item.student.id) {
            param.relative_entry = {
              type: 'TEACHE_SCHEDULE_STUDENT',
              student_id: item.student.id,
              id: item.id
            };
          }
          if (item.customer && item.customer.id) {
            param.relative_entry = {
              type: 'TEACHE_SCHEDULE_CUSTOMER',
              customer_id: item.customer.id,
              id: item.id
            };
          }
          if (param.relative_entry) {
            obs = obs.pipe(
              mergeMap((oldRes) => this.excel.save(param, res.id.toString())),
              map((newRes: CurriculumScheduleModel) => {
                this._newComponentValue = newRes;
                return newRes;
              })
            );
          }
        }
        return obs;
      }
    }
    return of(res);
  }

  /**
   * 保存更新排课删除实体
   */
  private _updateDeleteRelativeEntry(res: CurriculumScheduleModel) {
    if (res.relativeEntries && res.relativeEntries.length > 0) {
      let obs = of(res);
      for (const item of res.relativeEntries) {
        let isCon = false;
        if (this.componentValue.relativeEntries && this.componentValue.relativeEntries.length > 0) {
          for (const entry of this.componentValue.relativeEntries) {
            if ((item.student && entry.student && item.student.id === entry.student.id)
              || (item.customer && entry.customer && item.customer.id === entry.customer.id)) {
              isCon = true;
              break;
            }
          }
        } else {
          isCon = false;
        }
        if (!isCon) {
          const param = Object.assign({
            school_id: res.school.id,
            action: 'removeRelativeEntry',
            relative_entry: {
              id: item.id,
              type: item.type.value
            }
          }, res);
          obs = obs.pipe(
            mergeMap((oldRes) => this.excel.save(param, res.id.toString())),
            map((newRes: CurriculumScheduleModel) => {
              this._newComponentValue = newRes;
              return newRes;
            })
          );
        }
      }
      return obs;
    }
    return of(res);
  }
}
