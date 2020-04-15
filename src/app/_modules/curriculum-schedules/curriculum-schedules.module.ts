import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule, MatIconModule, MatProgressSpinnerModule, MatButtonModule } from '@angular/material';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxExcelModule } from 'ngx-excel';
import {BackendSharedModule} from '@uni/core';
import {ContextMenuModule} from 'ngx-contextmenu';
// component
import {CurriculumSchedulesPageComponent} from './components/curriculum-schedules-page/curriculum-schedules-page.component';
import {
  CurriculumSchedulesCalendarComponent
} from './components/curriculum-schedules-calendar/curriculum-schedules-calendar.component';
import {
  CurriculumSchedulesClassroomComponent
} from './components/curriculum-schedules-classroom/curriculum-schedules-classroom.component';
import {
  CurriculumSchedulesGridComponent
} from './components/curriculum-schedules-grid/curriculum-schedules-grid.component';
import {CurriculumSchedulesListComponent} from './components/curriculum-schedules-list/curriculum-schedules-list.component';
import {
  CurriculumSchedulesEditBasicComponent
} from './components/curriculum-schedules-edit-basic/curriculum-schedules-edit-basic.component';
import {
  CurriculumSchedulesEditMinorComponent
} from './components/curriculum-schedules-edit-minor/curriculum-schedules-edit-minor.component';
import {
  CurriculumSchedulesEditComponent
} from './components/curriculum-schedules-edit/curriculum-schedules-edit.component';
import {
  CurriculumSchedulesEditEntriesComponent
} from './components/curriculum-schedules-edit-entries/curriculum-schedules-edit-entries.component';
import {
  CurriculumSchedulesEntriesStudentComponent
} from './components/curriculum-schedules-entries/curriculum-schedules-entries-student/curriculum-schedules-entries-student.component';
import {
  CurriculumSchedulesEntriesClassComponent
} from './components/curriculum-schedules-entries/curriculum-schedules-entries-class/curriculum-schedules-entries-class.component';
import {
  CurriculumSchedulesEntriesCustomerComponent
} from './components/curriculum-schedules-entries/curriculum-schedules-entries-customer/curriculum-schedules-entries-customer.component';
import {
  CurriculumSchedulesSigningClassComponent
} from './components/curriculum-schedules-signing-class/curriculum-schedules-signing-class.component';
import {CurriculumSchedulesEditEntriesDataService} from './services/curriculum-schedules-edit-entries-data.service';
import {CurriculumSchedulesStateService} from './services/curriculum-schedules-state.service';
import {CurriculumSchedulesSearchComponent} from './components/curriculum-scheduls-search/curriculum-schedules-search.component';
import {CurriculumSchedulesAutoCoursesComponent} from './components/curriculum-schedules-auto-courses/curriculum-schedules-auto-courses.component';
import {CurriculumSchedulesFailureDetailsComponent} from './components/curriculum-schedules-failure-details/curriculum-schedules-failure-details.component';
import {CurriculumSchedulesImportComponent} from './components/curriculum-schedules-import/curriculum-schedules-import.component';


@NgModule({
  declarations: [
    CurriculumSchedulesPageComponent,
    CurriculumSchedulesListComponent,
    CurriculumSchedulesCalendarComponent,
    CurriculumSchedulesClassroomComponent,
    CurriculumSchedulesGridComponent,
    CurriculumSchedulesEditComponent,
    CurriculumSchedulesEditEntriesComponent,
    CurriculumSchedulesEditBasicComponent,
    CurriculumSchedulesEditMinorComponent,
    CurriculumSchedulesEntriesStudentComponent,
    CurriculumSchedulesEntriesCustomerComponent,
    CurriculumSchedulesEntriesClassComponent,
    CurriculumSchedulesSigningClassComponent,
    CurriculumSchedulesSearchComponent,
    CurriculumSchedulesAutoCoursesComponent,
    CurriculumSchedulesFailureDetailsComponent,
    CurriculumSchedulesImportComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    MatRippleModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NgZorroAntdModule,
    NgxExcelModule,
    BackendSharedModule,
    ContextMenuModule
  ],
  exports: [
    CurriculumSchedulesPageComponent
  ],
  entryComponents: [
    CurriculumSchedulesCalendarComponent,
    CurriculumSchedulesClassroomComponent,
    CurriculumSchedulesGridComponent,
    CurriculumSchedulesListComponent,
    CurriculumSchedulesEditComponent,
    CurriculumSchedulesEditEntriesComponent,
    CurriculumSchedulesEditBasicComponent,
    CurriculumSchedulesEditMinorComponent,
    CurriculumSchedulesEntriesStudentComponent,
    CurriculumSchedulesEntriesCustomerComponent,
    CurriculumSchedulesEntriesClassComponent,
    CurriculumSchedulesSigningClassComponent,
    CurriculumSchedulesSearchComponent,
    CurriculumSchedulesAutoCoursesComponent,
    CurriculumSchedulesFailureDetailsComponent,
    CurriculumSchedulesImportComponent
  ],
  providers: [
    CurriculumSchedulesStateService,
    CurriculumSchedulesEditEntriesDataService
  ]
})
export class CurriculumSchedulesModule {}
