import { Injectable } from '@angular/core';
import { NgxExcelComponentService } from 'ngx-excel';
import { Subject, of } from 'rxjs';
import { StudentTransferSchool, StudentTransferSchoolDetails } from '../../../models/student-transfer-school.model';
import { StudentChangeSchoolDetailsService } from '../../../service/students/student-transfer-school-details.service';

@Injectable()
export class StudnetAchievementEditSubentryComponentService extends NgxExcelComponentService {

  public autoCommitKeys = ['intoCmpus'] as Array<keyof StudentTransferSchool>;

  private _ccrnCurrentConfigStream = new Subject<any>();

  constructor(
    protected studentChangeSchoolDetailsService: StudentChangeSchoolDetailsService
  ) {
    super();
  }

  public handleIntoCmpusChanged(_: StudentTransferSchool, model: StudentTransferSchool) {
    this._ccrnCurrentConfigStream.next(model);
    this.studentChangeSchoolDetailsService.getModel(
      model.student.id,
      { old_campus: model.campus, new_campus: model.intoCmpus.value }
    ).subscribe((result: StudentTransferSchoolDetails) => {
      console.log(result, 'result1111');
    });
    return of([{ action: 'updated', context: model }]);
  }






}
