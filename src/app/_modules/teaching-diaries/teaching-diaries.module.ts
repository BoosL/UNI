import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatRippleModule, MatIconModule, MatProgressSpinnerModule, MatButtonModule} from '@angular/material';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {NgxExcelModule} from 'ngx-excel';
import {BackendSharedModule} from '@uni/core';
// http-service
import {TeachingDiariesComponent} from './components/teaching-diaries/teaching-diaries.component';
import {TeacherCurriculumSchedulesService} from './_services/teacher-curriculum-schedules.service';
import {TeachingDiariesCalendarComponent} from './components/teaching-diaries-calendar/teaching-diaries-calendar.component';
import {TeachingDiariesListComponent} from './components/teaching-diaries-list/teaching-diaries-list.component';
import {EntryStudentService} from '../curriculum-schedules/_services/entry-student.service';
import {SignClassService} from '../curriculum-schedules/_services/sign-class.service';
import {CurriculumScheduleService} from '../curriculum-schedules/_services/curriculum-schedule.service';
import {RelativeEntryService} from '../curriculum-schedules/_services/relative-entry.service';
import {CustomerService} from '../curriculum-schedules/_services/customer.service';
import {SmallClassService} from '../curriculum-schedules/_services/small-class.service';
import {TeachingDiariesListDataService} from './services/teaching-diaries-list-data.service';
import {TeachingDiariesEditComponent} from './components/teaching-diaries-edit/teaching-diaries-edit.component';
import {TeachingDiariesEntryService, TeachingDiariesService} from './_services/teaching-diaries.service';
import {TeachingDiariesEditEntriesComponent} from './components/teaching-diaries-edit-entries/teaching-diaries-edit-entries.component';
import {TeachingDiariesEditEntriesDataService} from './services/teaching-diaries-edit-entries-data.service';


const providers = [
  TeacherCurriculumSchedulesService,
  EntryStudentService,
  SignClassService,
  CurriculumScheduleService,
  RelativeEntryService,
  CustomerService,
  SmallClassService,
  TeachingDiariesService,
  TeachingDiariesEntryService,
  TeachingDiariesListDataService,
  TeachingDiariesEditEntriesDataService
]

@NgModule({
  declarations: [
    TeachingDiariesComponent,
    TeachingDiariesCalendarComponent,
    TeachingDiariesListComponent,
    TeachingDiariesEditComponent,
    TeachingDiariesEditEntriesComponent
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
  ],
  exports: [
    TeachingDiariesComponent
  ],
  entryComponents: [
    TeachingDiariesComponent,
    TeachingDiariesCalendarComponent,
    TeachingDiariesListComponent,
    TeachingDiariesEditComponent,
    TeachingDiariesEditEntriesComponent
  ],
  providers: [
    ...providers
  ]
})
export class TeachingDiariesModule {
}
