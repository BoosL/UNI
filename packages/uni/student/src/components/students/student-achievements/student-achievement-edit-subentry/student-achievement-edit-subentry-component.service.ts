import { Injectable } from '@angular/core';
import { NgxExcelComponentService } from 'ngx-excel';
import { Subject, of } from 'rxjs';
import { StudentSubjects } from '../../../../models/student-achievements.model';

@Injectable()
export class StudnetAchievementEditSubentryComponentService extends NgxExcelComponentService {

  public autoCommitKeys = ['name', 'fraction', 'remark'] as Array<keyof StudentSubjects>;

  private _ccrnCurrentConfigStream = new Subject<any>();

  constructor() {
    super();
  }

  public handleNameChanged(_: StudentSubjects, model: StudentSubjects) {
    this._ccrnCurrentConfigStream.next(model);
    return of([{ action: 'updated', context: model }]);
  }

  public handleFractionChanged(_: StudentSubjects, model: StudentSubjects) {
    this._ccrnCurrentConfigStream.next(model);
    return of([{ action: 'updated', context: model }]);
  }

  public handleRemarkChanged(_: StudentSubjects, model: StudentSubjects) {
    this._ccrnCurrentConfigStream.next(model);
    return of([{ action: 'updated', context: model }]);
  }

  public get ccrnCurrentConfig$() {
    return this._ccrnCurrentConfigStream.asObservable();
  }






}
