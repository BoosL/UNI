import { Injectable } from '@angular/core';
import { NgxExcelComponentService } from 'ngx-excel';
import { StudentFollowsThemeService } from '../../../../../service/students/student-follows-theme.service';

@Injectable()
export class StudentFollowsComponentService extends NgxExcelComponentService {



  constructor(
    private studentFollowsThemeService: StudentFollowsThemeService
  ) {
    super();
  }



}
