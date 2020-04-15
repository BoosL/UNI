import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule, MatIconModule, MatProgressSpinnerModule, MatButtonModule } from '@angular/material';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxExcelModule } from 'ngx-excel';
import { BackendSharedModule } from '@uni/core';
import { TeacherSchedulesComponent } from './components/teacher-schedules/teacher-schedules.component';
import { TeacherScheduleEditComponent } from './components/teacher-schedule-edit/teacher-schedule-edit.component';

@NgModule({
  declarations: [
    TeacherSchedulesComponent,
    TeacherScheduleEditComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatRippleModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NgZorroAntdModule,
    NgxExcelModule,
    BackendSharedModule,
  ],
  exports: [
    TeacherSchedulesComponent
  ],
  entryComponents: [
    TeacherScheduleEditComponent
  ]
})
export class TeacherSchedulesModule { }
