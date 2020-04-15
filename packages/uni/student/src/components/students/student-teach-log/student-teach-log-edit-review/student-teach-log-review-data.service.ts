import { Injectable } from '@angular/core';
import { NgxExcelDataService } from 'ngx-excel';
import { StudentTeacherLogComment } from '../../../../models/student-teach-logs.model';
import { StudentTeachLogCommentsService } from '../../../../service/students/student-teach-log-comments.service';

@Injectable()
export class StudentTeachLogReviewDataService extends NgxExcelDataService<StudentTeacherLogComment> {

  constructor(
    protected excel: StudentTeachLogCommentsService
  ) {
    super();
  }


  /**
   * @inheritdoc
   */
  public getRules() {
    return this.excel.getRules();
  }

  public createModel(attributes?: Partial<StudentTeacherLogComment>, o?: any) {
    return this.excel.createModel(attributes, o);
  }



}
