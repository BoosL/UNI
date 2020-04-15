import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import {Classroom} from '@uni/core';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {CurriculumScheduleModel} from '../../models/curriculum-schedule.model';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {NzMessageService} from 'ng-zorro-antd';
import {CdkDrag, CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop';

@Component({
  selector: 'curriculum-schedules-classroom',
  templateUrl: './curriculum-schedules-classroom.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurriculumSchedulesClassroomComponent implements OnInit, OnDestroy {
  public classroomData;
  public dragIsStart = false;
  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();
  @Input() classroomListSubject: Observable<Classroom[]>;
  @Input() curriculumSchedulesSubject: Observable<CurriculumScheduleModel[]>;
  @Output() handleScheduleDrag = new EventEmitter<any>();

  constructor(
    protected changeDetectorRef: ChangeDetectorRef,
    protected message: NzMessageService,
  ) {
  }

  ngOnInit() {
    this._componentSubscription.add(combineLatest(this.curriculumSchedulesSubject, this.classroomListSubject).pipe(
      map((resultSet) => {
        return { classroomList: resultSet[1], schedulesList: resultSet[0] };
      }),
      distinctUntilChanged(),
      ).subscribe(
      (res) => this._getClassroomCurriculumSchedules(res.schedulesList, res.classroomList),
      (e) => this.message.error(e.message || '系统错误，请联系管理员')
      )
    );
  }

  ngOnDestroy(): void {
    this._componentSubscription.unsubscribe();
  }

  /**
   * 计算教室排课数
   * @param res 排课列表， classroomList教室列表
   */
  private _getClassroomCurriculumSchedules(res: CurriculumScheduleModel[], classroomList: Classroom[]) {
    const classroomMap = new Map();
    this.classroomData = [];
    if (res && res.length > 0) {
      for (const item of res) {
        if (item.classroom) {
          let count = classroomMap.get(item.classroom.id.toString()) || 0;
          count = count + 1;
          classroomMap.set(item.classroom.id.toString(), count);
        }
        continue;
      }
    }
    if (classroomList) {
      for (const item of classroomList) {
        this.classroomData.push({ classroom: item, count: classroomMap.get(item.id.toString()) || 0 });
      }
      this.changeDetectorRef.markForCheck();
    }
  }

  public drop(event: CdkDragDrop<string[]>) {
    this.handleScheduleDrag.emit(event);
  }

  public dropLimit(drag: CdkDrag, drop: CdkDropList) {
    if (drag.data && drag.data.classroom) {
      // 拖入无排课教室
      if (drop.data[0] && drop.data[0].classroom) {
        return false;
      }
    }
    if (drag.data && drag.data.schedule && drag.data.schoolResource && drop.data[0] && drop.data[0].classroom) {
      for (const item of drag.data.schoolResource.classrooms) {
        if (item.id.toString() === drop.data[0].classroom.id) {
          this.dragIsStart = true;
          return false;
        }
      }
    }
    return true;
  }

  public dragStart(event: CdkDragDrop<string[]>) {
    this.dragIsStart = true;
    this.changeDetectorRef.markForCheck();
  }

  public dragEnd(event: CdkDragDrop<string[]>) {
    this.dragIsStart = false;
    this.changeDetectorRef.markForCheck();
  }
}
