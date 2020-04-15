import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatRippleModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule } from '@angular/material';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxExcelModule } from 'ngx-excel';
import { BackendSharedModule } from '../shared/shared.module';
import { AvailableRestDateService } from './services/available-rest-date.service';
import { ConfirmedScheduleEditDataService } from './services/confirmed-schedule-edit-data.service';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { UnconfirmedScheduleEditComponent } from './components/unconfirmed-schedule-edit/unconfirmed-schedule-edit.component';
import { ConfirmedScheduleEditComponent } from './components/confirmed-schedule-edit/confirmed-schedule-edit.component';

@NgModule({
  declarations: [
    ScheduleComponent,
    UnconfirmedScheduleEditComponent,
    ConfirmedScheduleEditComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    NgZorroAntdModule,
    NgxExcelModule,
    BackendSharedModule
  ],
  exports: [
    ScheduleComponent
  ],
  providers: [
    AvailableRestDateService,
    ConfirmedScheduleEditDataService
  ],
  entryComponents: [
    UnconfirmedScheduleEditComponent,
    ConfirmedScheduleEditComponent
  ]
})
export class ScheduleModule {}
