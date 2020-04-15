import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { INgxExcelDataSource, NgxExcelComponentService, NgxExcelModelColumnRules } from 'ngx-excel';
import { ClassroomService, Classroom } from '@uni/core';
import { SchoolClassroomsComponentService } from '../../services/school-classrooms-component.service';
import { Observable } from 'rxjs';
import { NzDrawerRef } from 'ng-zorro-antd';

@Component({
  selector: 'school-classroom',
  templateUrl: './school-classroom.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: ClassroomService },
    { provide: NgxExcelComponentService, useClass: SchoolClassroomsComponentService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchoolClassroomComponent implements OnInit {

  rules: NgxExcelModelColumnRules<Classroom>;

  @Input() classroom: Classroom;

  constructor(
    protected drawerRef: NzDrawerRef<Classroom>,
    protected classroomService: ClassroomService
  ) { }

  ngOnInit() {
    this.rules = this.classroomService.getRules();
  }

  confirm() {
    this.drawerRef.close(this.classroom);
  }

  dismiss() {
    this.drawerRef.close();
  }

}
