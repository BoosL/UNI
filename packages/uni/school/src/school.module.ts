import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatRippleModule, MatIconModule, MatProgressSpinnerModule, MatButtonModule } from '@angular/material';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxExcelModule } from 'ngx-excel';
import { BackendSharedModule } from '@uni/core';
import { CurriculumModule } from '@uni/curriculum';
import { SchoolBasicComponent } from './components/school-basic/school-basic.component';
import { SchoolClassroomComponent } from './components/school-classroom/school-classroom.component';
import { SchoolClassroomEditComponent } from './components/school-classroom-edit/school-classroom-edit.component';
import { SchoolClassroomsComponent } from './components/school-classrooms/school-classrooms.component';
import { SchoolCurriculumManagerComponent } from './components/school-curriculum-manager/school-curriculum-manager.component';
import { SchoolRestTimeComponent } from './components/school-rest-time/school-rest-time.component';
import { SchoolRestTimeEditComponent } from './components/school-rest-time-edit/school-rest-time-edit.component';
import { SchoolComponent } from './components/components';

@NgModule({
  declarations: [
    SchoolBasicComponent,
    SchoolClassroomComponent,
    SchoolClassroomEditComponent,
    SchoolClassroomsComponent,
    SchoolCurriculumManagerComponent,
    SchoolRestTimeComponent,
    SchoolRestTimeEditComponent,
    SchoolComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatRippleModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NgZorroAntdModule,
    NgxExcelModule,
    BackendSharedModule,
    CurriculumModule
  ],
  exports: [
    SchoolComponent
  ],
  entryComponents: [
    SchoolClassroomsComponent,
    SchoolCurriculumManagerComponent,
    SchoolRestTimeComponent,
    SchoolClassroomEditComponent,
    SchoolRestTimeEditComponent,
    SchoolComponent
  ]
})
export class SchoolModule { }
