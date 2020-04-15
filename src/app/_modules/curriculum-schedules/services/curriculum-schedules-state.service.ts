import {Injectable} from '@angular/core';
import {CurriculumScheduleModel} from '../models/curriculum-schedule.model';
import {CurriculumScheduleService} from '../_services/curriculum-schedule.service';
import {utc} from 'moment';
import {School, ClassroomService, Classroom} from '@uni/core';
import {Observable, Subject, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {TeachingResourceService} from '../_services/teaching-resource.service';
import {TeachingResourceModel} from '../models/teaching-resource.model';
import {CurriculumSchedulesImportExportService} from '../_services/curriculum-schedules-import-export.service';

@Injectable()
export class CurriculumSchedulesStateService {
  // tslint:disable: variable-name
  // 当前校区
  private _relativeSchool: School;
  // 当前日期
  private _scheduleDate: string;
  // 当前月
  private _scheduleMonth: string;
  // 当前日期排课
  private _curriculumSchedules: CurriculumScheduleModel[];
  // 当前月份排课
  private _monthSchedules: CurriculumScheduleModel[];
  private _monthSchedulesSubject = new Subject<any>();
  private changeScheduleSubject = new Subject<any>();
  private _classroomIds;
  private _columnCount = 0;
  // 排课状态对应颜色
  private _scheduleTypeColors = [
    '#1890ff', // 未排课
    '#15ab92', // 已排课
    '#faad14', // 审核中
    '#faad14', // 审核中
    '#15ab92', // 已签课
    '#f5222d', // 已排课未签课
    '#1890ff', // blue
  ];
  // 排课时间
  private _startTimeArea = 0;
  private _endTimeArea = 23;

  constructor(
    protected curriculumSchedulesService: CurriculumScheduleService,
    protected teachingResourceService: TeachingResourceService,
    protected classRoomService: ClassroomService,
    protected downloadService: CurriculumSchedulesImportExportService
  ) {
  }

  /**
   * 获取排课状态对应颜色
   */
  public getScheduleStatusColors() {
    return this._scheduleTypeColors;
  }

  /**
   * 获取当前视图校区
   */
  public getCurrentSchool() {
    return this._relativeSchool || null;
  }

  /**
   * 获取当前时间
   */
  public getCurrentDate() {
    return this._scheduleDate;
  }

  /**
   * 获取月排课数据
   */
  public getMonthSchedulesSubject(): Observable<CurriculumScheduleModel[]> {
    return this._monthSchedulesSubject as Observable<CurriculumScheduleModel[]>;
  }

  public setFilters({ date = '', school = null }) {
    if (school && (!this._relativeSchool || (school && this._relativeSchool.id !== school.id))) {
      this._relativeSchool = school;
      this._getMonthSchedules();
    }
    if (date) {
      this._scheduleDate = date;
      const _yearMonth = utc(this._scheduleDate).format('YYYY-MM');
      if (!this._scheduleMonth || _yearMonth !== this._scheduleMonth) {
        this._scheduleMonth = _yearMonth;
        this._getMonthSchedules();
      }
    }
  }

  /**
   * 获取日期排课数据
   */
  public getDateSchedules(filters): Observable<CurriculumScheduleModel[]> {
    /*  const param = {
        school_id: this._relativeSchool.id
      };
      if (this._scheduleDate) {
        Object.assign(param, {
          start_date: this._scheduleDate,
          end_date: this._scheduleDate
        });
      }*/
    return this.curriculumSchedulesService.getList(filters).pipe(
      map((res) => {
        this._curriculumSchedules = res;
        return res;
      })
    );
  }

  /**
   * 获取月份排课数据
   * @param type 是否绕过日期检测
   */
  private _getMonthSchedules() {
    if (this._scheduleMonth && this._relativeSchool) {
      const _startDate = this._scheduleMonth + '-01';
      const _endDate = utc(_startDate).add(1, 'month').add(-1, 'days').format('YYYY-MM-DD');
      return this.curriculumSchedulesService.getList({
        school_id: this._relativeSchool.id,
        start_date: _startDate,
        end_date: _endDate
      }).subscribe((res) => {
        this._monthSchedules = res;
        this._monthSchedulesSubject.next(res);
      });
    }
  }

  /**
   * 获取校区不可用资源
   */
  public getTeachingResource(): Observable<{ [name: string]: TeachingResourceModel }> {
    const _scheduleDate = this.getCurrentDate();
    if (!_scheduleDate) {
      return of(null);
    }
    const params = {
      school_id: this._relativeSchool.id,
      start_time: _scheduleDate + ' 00:00',
      end_time: utc(_scheduleDate).add(1, 'day').format('YYYY-MM-DD HH:mm'),
      time_unit: '60'
    };
    return this.teachingResourceService.getList(params).pipe(
      map((res: TeachingResourceModel[]) => {
        const _schoolResource = {};
        for (const item of res) {
          const time = utc(item.datetime).format('HH:mm');
          _schoolResource[time] = item;
        }
        return _schoolResource;
      })
    );
  }

  /**
   * 获取校区教室列表
   */
  public getClassRooms(): Observable<Classroom[]> {
    return this.classRoomService.getList({ school_id: this._relativeSchool.id });
  }

  /**
   * 确认课表
   */
  public handleConfirmSchedules() {
    return this.curriculumSchedulesService.batchUpdate({
      date: this._scheduleDate,
      schoolId: this._relativeSchool.id
    }).pipe(
      map((res: CurriculumScheduleModel[]) => {
        this._curriculumSchedules = res;
        return res;
      })
    );
  }

  /**
   * 获取课表下载地址
   */
  public handleDownloadSchedules() {
    return this.downloadService.downloadCurriculumSchedule(this._scheduleDate);
  }

  /**
   * 获取失败明细下载地址
   */
  public handleDownloadFailureDetails() {
    return this.downloadService.downloadFailureDetails(this._scheduleDate);
  }

  /**
   * 处理排课变更
   */
  public handleScheduleChange(data: any): CurriculumScheduleModel[] {
    switch (data.action) {
      case 'add':
        this._curriculumSchedules = this._curriculumSchedules ? this._curriculumSchedules : [];
        this._curriculumSchedules.push(data.schedule);
        break;
      case 'update':
        if (!(data.schedule instanceof Array)) {
          data.schedule = [data.schedule];
        }
        for (const item of data.schedule) {
          for (const _schedule of this._curriculumSchedules) {
            if (_schedule.id === item.id) {
              this._curriculumSchedules.splice(this._curriculumSchedules.indexOf(_schedule), 1, item);
              break;
            }
          }
        }
        break;
      case 'delete':
        if (this._curriculumSchedules && this._curriculumSchedules.length >= 0) {
          for (const item of this._curriculumSchedules) {
            if (item.id === data.schedule.id) {
              this._curriculumSchedules.splice(this._curriculumSchedules.indexOf(item), 1);
              break;
            }
          }
        }
        break;
    }
    if (this._monthSchedules) {
      this._monthSchedules = this._monthSchedules.filter((item) => {
        return utc(item.time).format('YYYY-MM-DD') !== utc(this._scheduleDate).format('YYYY-MM-DD');
      });
      this._monthSchedules.push(...this._curriculumSchedules);
    } else {
      this._monthSchedules = [...this._curriculumSchedules];
    }
    this._monthSchedulesSubject.next(this._monthSchedules);
    return this._curriculumSchedules;
  }

  /**
   * 设置排课教室
   * @param _classroom将要设置得教室 _scheduleData {schedule: 排课，classroomList： 不可用教室资源}
   */
  public setScheduleClassroom(_classroom: Classroom, _scheduleData: any): Observable<CurriculumScheduleModel> {
    const _schedule = _scheduleData.schedule as CurriculumScheduleModel;
    return this.curriculumSchedulesService.save(Object.assign({}, _schedule, {
      schoolId: _schedule.school.id,
      action: 'allocateClassroom',
      classroom: _classroom
    }), _schedule.id.toString());
  }


  /**
   * 统计已排课教室列表
   */
  public getSchedulesClassRooms(_schoolResource) {
    this._classroomIds = [];
    const classrooms = [];
    if (this._curriculumSchedules && this._curriculumSchedules.length > 0) {
      for (const item of this._curriculumSchedules) {
        const resource = _schoolResource[utc(item.time).format('HH:mm')];
        if (item.classroom && item.classroom.id && !(resource && resource.allClassrooms && resource.allTeachers)) {
          if (!this._classroomIds.includes(item.classroom.id)) {
            this._classroomIds.push(item.classroom.id);
            classrooms.push(item.classroom);
          }
        }
      }
    }
    this._classroomIds.sort((v, n) => {
      if (v >= n) {
        return -1;
      }
      return 1;
    });
    classrooms.sort((v, n) => {
      if (v.id >= n.id) {
        return 1;
      }
      return -1;
    });
    return classrooms;
  }

  /**
   * 排课课程按教室和时间分类
   */
  public getClassroomSchedulesData(_schoolResource) {
    let _isNotAbleContinueTime = [];
    const list = [];
    /*  if (!this._curriculumSchedules || this._curriculumSchedules.length <= 0) {
        return [];
      }*/
    for (let i = this._startTimeArea; i <= this._endTimeArea; i++) {
      let count = 0;
      const _preTime = i > 0 ? (i < 11 ? '0' + (i - 1) : (i - 1)) + ':00' : '';
      const _preItem = _preTime ? list[list.length - 1] : null;
      const _time = (i < 10 ? '0' + i : i) + ':00';
      let item = {
        time: _time,
        datetime: this._scheduleDate + ' ' + _time,
        schoolResource: _schoolResource[_time] ? _schoolResource[_time] : null,
        schedules: []
      };
      if (_schoolResource[_time] && _schoolResource[_time].allClassrooms && _schoolResource[_time].allTeachers) {
        _isNotAbleContinueTime.push(_time);
        if (_schoolResource[_preTime] && _schoolResource[_preTime].allClassrooms && _schoolResource[_preTime].allTeachers) {
          item = _preItem;
          item.time = _time;
        }
      } else {
        _isNotAbleContinueTime = [];
      }
      // 占位
      if (!item.schedules || item.schedules.length <= 0) {
        item.schedules.length = this._classroomIds ? this._classroomIds.length : 0;
      }
      if (this._curriculumSchedules && this._curriculumSchedules.length > 0) {
        for (const aitem of this._curriculumSchedules) {
          if (item.time === utc(aitem.time).format('HH:mm')) {
            if (_schoolResource[item.time] && _schoolResource[item.time].allClassrooms && _schoolResource[item.time].allTeachers) {
              item.schedules.push(aitem);
            } else {
              if (aitem.classroom) {
                const index = this._classroomIds.indexOf(aitem.classroom.id);
                if (index >= 0) {
                  item.schedules[index] = aitem;
                } else {
                  item.schedules.push(aitem);
                }
              } else {
                item.schedules.push(aitem);
              }
            }

          }
        }
      }

      count = item.schedules ? item.schedules.length : 0;
      item.schedules.reverse();
      this._columnCount = item.schedules.length > this._columnCount ? item.schedules.length : this._columnCount;
      if (list.indexOf(item) < 0) {
        list.push(item);
      } else {
        // 合并连续不可用时间
        const _nextTime = i < 23 ? (i < 9 ? '0' + (i + 1) : (i + 1)) + ':00' : '';
        if ((i < 23 && !(_schoolResource[_nextTime] && _schoolResource[_nextTime].allClassrooms &&
          _schoolResource[_nextTime].allTeachers) && _isNotAbleContinueTime.length > 0) || i === 23) {
          item.time = _isNotAbleContinueTime[0] + '-' + _isNotAbleContinueTime[_isNotAbleContinueTime.length - 1];
        }
      }
    }
    return list;
  }

  /**
   * 判断排课是否已确认
   */
  public judgeScheduleIsConfirm(): boolean {
    if (this._curriculumSchedules && this._curriculumSchedules.length > 0) {
      // 有排课的情况
      return (this._curriculumSchedules[0].status.value !== '1');
    } else {
      // 没有排课情况
      const _currentdate = utc().local().format('YYYY-MM-DD HH:mm:ss');
      // 当前时间 <= (订课日期 - 1天) 18:00:00
      if (this._scheduleDate) {
        const _limitDate = utc(this._scheduleDate + ' 18:00:00').local().add(-1, 'days');
        return !(utc(_currentdate).local().isBefore(_limitDate));
      }
      return false;
    }
  }

  public getColumnCount() {
    return this._columnCount;
  }

  public changeSchedule(data: CurriculumScheduleModel) {
    this.changeScheduleSubject.next(data);
  }

  public getChangeScheduleSubject(): Observable<CurriculumScheduleModel> {
    return this.changeScheduleSubject as Observable<CurriculumScheduleModel>;
  }

  public clearData() {
    this._curriculumSchedules = null;
    this._monthSchedules = null;
    this._scheduleMonth = '';
  }
}
