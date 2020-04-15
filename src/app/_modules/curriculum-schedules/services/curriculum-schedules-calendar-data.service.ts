import {Injectable} from '@angular/core';
import {CurriculumScheduleModel} from '../models/curriculum-schedule.model';
import * as moment from 'moment';
import {Observable, of} from 'rxjs';

@Injectable()
export class CurriculumSchedulesCalendarDataService {
  /**
   * 组装该月对应每天排课状态
   * @param res 月排课列表
   */
  public getDateStatus(res: CurriculumScheduleModel[]): Observable<{[name: string]: any}> {
    // tslint:disable: variable-name
    let _dateScheduleStatus = {};
    let _scheduleStatus = {};
    if (res && res.length > 0) {
      for (const item of res) {
        const key = moment(item.time).format('YYYY-MM-DD');
        if (!_dateScheduleStatus) {
          _dateScheduleStatus = {};
        }
        if (!_scheduleStatus) {
          _scheduleStatus = {};
        }
        if (!_dateScheduleStatus[key] || _dateScheduleStatus[key] !== 'red-background') {
          // tslint:disable: no-string-literal
          if (!item['isComplete']) {
            _dateScheduleStatus[key] = 'red-background';
          } else {
            _dateScheduleStatus[key] = 'green-background';
          }
        }
        if (_scheduleStatus[key]) {
          if (item.status.value === '1') {
            _scheduleStatus[key] = item.status.value;
            continue;
          }
          if (['3', '4'].includes(item.status.value) && ['2', '5', '6'].includes(_scheduleStatus[key])) {
            _scheduleStatus[key] = item.status.value;
            continue;
          }
          if ((item.status.value === '2' && ['2', '5'].includes(_scheduleStatus[key]))
            || (item.status.value === '5' && _scheduleStatus[key] === '2')) {
            const days = moment(key).diff(moment().local(), 'day');
            if (days <= -1) {
              _scheduleStatus[key] = '6';
              continue;
            }
          }
        } else {
          _scheduleStatus[key] = item.status.value;
          if (_scheduleStatus[key] === '2') {
            const days = moment(key).diff(moment().local(), 'day');
            if (days <= -1) {
              _scheduleStatus[key] = '6';
              continue;
            }
          }
        }
      }
    }
    return of({dateScheduleStatus: _dateScheduleStatus, scheduleStatus: _scheduleStatus });
  }
}
