import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  MatRippleModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatButtonModule
} from '@angular/material';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxExcelModule } from 'ngx-excel';
import { BackendSharedModule } from '@uni/core';
import { StudentModule } from '@uni/student';



import { StudentsPageComponent } from './components/students-page/students-page.component';
import { StudentPageComponent } from './components/student-page/student-page.component';
import { StudentsSearchComponent } from './components/students-search/students-search.component';

import { StudentsComplainPageComponent } from './components/students-complain-page/students-complain-page.component';
import { StudentComplainPageComponent } from './components/student-complain-page/student-complain-page.component';

import {

  StudentPrimaryClassEditComponent,
  StudentPrimaryClassEditUczeComponent,
  StudentsPrimaryClassPageComponent,

  StudentPrimaryClassPageComponent,
  StudentPrimaryClassComponent,
  StudentPrimaryClassProductComponent,
  StudentPrimaryClassUczeComponent,
} from './components/student-primary-class/student-primary-class';



const provideComponent = [
  StudentPrimaryClassEditComponent,
  StudentPrimaryClassEditUczeComponent,
  StudentPrimaryClassComponent,
  StudentPrimaryClassProductComponent,
  StudentPrimaryClassUczeComponent,
];


@NgModule({
  declarations: [
    StudentsPageComponent,
    StudentPageComponent,
    StudentsSearchComponent,
    StudentPrimaryClassPageComponent,
    StudentsPrimaryClassPageComponent,
    StudentsComplainPageComponent,
    StudentComplainPageComponent,
    ...provideComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgZorroAntdModule,
    NgxExcelModule,
    BackendSharedModule,
    MatRippleModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    StudentModule
  ],
  exports: [],
  entryComponents: [
    StudentsPageComponent,
    StudentPageComponent,
    StudentsSearchComponent,
    StudentPrimaryClassPageComponent,
    StudentsPrimaryClassPageComponent,
    StudentsComplainPageComponent,
    StudentComplainPageComponent,
    ...provideComponent
  ],
})
export class StudentsModule { }
