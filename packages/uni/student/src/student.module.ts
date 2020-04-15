import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import {
  MatRippleModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatButtonModule
} from '@angular/material';
import { NgxExcelModule } from 'ngx-excel';
import { BackendSharedModule } from '@uni/core';
import { StudentCurriculumModule } from '@uni/student/curriculum';
import { ContractModule, ContractDtoService } from '@uni/contract';

// tslint:disable: max-line-length
// 学员
import { StudentComponent } from './components/students/student/student.component';
import { StudentAchievementCheckComponent } from './components/students/student-achievements/student-achievement-check/student-achievement-check.component';
import { StudentAchievementCheckSubentryComponent } from './components/students/student-achievements/student-achievement-check-subentry/student-achievement-check-subentry.component';
import { StudentAchievementEditComponent } from './components/students/student-achievements/student-achievement-edit/student-achievement-edit.component';
import { StudentAchievementEditSubentryComponent } from './components/students/student-achievements/student-achievement-edit-subentry/student-achievement-edit-subentry.component';
import { StudentAchievementsComponent } from './components/students/student-achievements/student-achievements/student-achievements.component';
import { StudentAllocationDetailComponent } from './components/students/student-allocation-detail/student-allocation-detail.component';
import { StudentBasicComponent } from './components/students/student-basic/student-basic.component';
import { StudentBillsComponent } from './components/students/student-bills/student-bills.component';
import { StudentChangeSchoolEditComponent } from './components/students/student-change-school-edit/student-change-school-edit.component';
import { StudentChangeSchoolDetailsComponent } from './components/students/student-change-school-edit/student-change-school-details/student-change-school-details.component';
import { StudentContractsComponent } from './components/students/student-contracts/student-contracts/student-contracts.component';
import { StudentContractPortletComponent } from './components/students/student-contracts/student-contract-porlet/student-contract-portlet.component';
import { StudentFeedBacksComponent } from './components/students/student-feedbacks/student-feedbacks/student-feedbacks.component';
import { StudentFeedbackEditComponent } from './components/students/student-feedbacks/student-feedback-edit/student-feedback-edit.component';
import { StudentFeedbackCheckComponent } from './components/students/student-feedbacks/student-feedback-check/student-feedback-check.component';
import { StudentFollowsComponent } from './components/students/student-follows/student-follows.component';
import { StudentCcFollowEditComponent } from './components/students/student-follows/student-cc-follows/student-cc-follow-edit/student-cc-follow-edit.component';
import { StudentCcFollowsComponent } from './components/students/student-follows/student-cc-follows/students-cc-follows/student-cc-follows.component';
import { StudentCcFollowsRecordsCheckComponent } from './components/students/student-follows/student-cc-follows/students-cc-follows-records-check/students-cc-follows-records-check.component';
import { StudentScFollowsComponent } from './components/students/student-follows/student-sc-follows/student-sc-follows/student-sc-follows.component';
import { StudentScFollowsEditComponent } from './components/students/student-follows/student-sc-follows/student-sc-follow-edit/student-sc-follow-edit.component';
import { StudentSchedulesComponent } from './components/students/student-schedules/student-schedules/student-schedules.component';
import { StudentScheduleEditComponent } from './components/students/student-schedules/student-schedule-edit/student-schedule-edit.component';
import { StudentTaskAfterClassComponent } from './components/students/student-task-after-class/student-task-after-class/student-task-after-class.component';
import { StudentTaskAfterClassEditComponent } from './components/students/student-task-after-class/student-task-after-class-edit/student-task-after-class-edit.component';
import { StudentTeachLogComponent } from './components/students/student-teach-log/student-teach-log/student-teach-log.component';
import { StudentTeachLogsEditComponent } from './components/students/student-teach-log/student-teach-log-edit/student-teach-log-edit.component';
import { StudentTeachLogsEditReviewComponent } from './components/students/student-teach-log/student-teach-log-edit-review/student-teach-log-edit-review.component';
import { StudentUseCurriculumComponent } from './components/students/student-use-curriculums/student-use-curriculums.component';


// 学员投诉
import { StudentComplainBasicComponent } from './components/students-complain/student-complain-basic/student-complain-basic.component';
import { StudentComplainBasicFollowEditComponent } from './components/students-complain/student-complain-basic-follow-edit/student-complain-basic-follow-edit.component';
import { StudentComplainBasicFollowsComponent } from './components/students-complain/student-complain-basic-follows/student-complain-basic-follows.component';
import { StudentContractService } from './service/students/student-contract.service';

// 学员合同操作记录
import { StudentContractLogsComponent } from './components/students/student-contract-logs/student-contract-logs.component';
import { StudentContractPurchaseRecordComponent } from './components/students/student-contract-logs/student-contract-purchase-record/student-contract-purchase-record.component';
import { StudentContractRefundRecordComponent } from './components/students/student-contract-logs/student-contract-refund-record/student-contract-refund-record.component';
import { StudentContractExchangeRecordComponent } from './components/students/student-contract-logs/student-contract-exchange-record/student-contract-exchange-record.component';
import { StudentContractRecordSubjectsComponent } from './components/students/student-contract-logs/student-contract-record-subjects/student-contract-record-subjects.component';
import { StudentContractTranslationRecordComponent } from './components/students/student-contract-logs/student-contract-translation-record/student-contract-translation-record.component';


@NgModule({
  declarations: [
    StudentComponent,
    StudentAchievementCheckComponent,
    StudentAchievementCheckSubentryComponent,
    StudentAchievementEditComponent,
    StudentAchievementEditSubentryComponent,
    StudentChangeSchoolEditComponent,
    StudentChangeSchoolDetailsComponent,
    StudentAchievementsComponent,
    StudentAllocationDetailComponent,
    StudentBasicComponent,
    StudentBillsComponent,
    StudentContractsComponent,
    StudentContractPortletComponent,
    StudentFeedBacksComponent,
    StudentFeedbackEditComponent,
    StudentFeedbackCheckComponent,
    StudentFollowsComponent,
    StudentCcFollowEditComponent,
    StudentCcFollowsComponent,
    StudentCcFollowsRecordsCheckComponent,
    StudentScFollowsComponent,
    StudentScFollowsEditComponent,
    StudentSchedulesComponent,
    StudentScheduleEditComponent,
    StudentTaskAfterClassComponent,
    StudentTaskAfterClassEditComponent,
    StudentTeachLogComponent,
    StudentTeachLogsEditComponent,
    StudentTeachLogsEditReviewComponent,
    StudentUseCurriculumComponent,

    StudentComplainBasicComponent,
    StudentComplainBasicFollowEditComponent,
    StudentComplainBasicFollowsComponent,

    StudentContractLogsComponent,
    StudentContractPurchaseRecordComponent,
    StudentContractRefundRecordComponent,
    StudentContractExchangeRecordComponent,
    StudentContractRecordSubjectsComponent,
    StudentContractTranslationRecordComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatRippleModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NgZorroAntdModule,
    NgxExcelModule,
    BackendSharedModule,
    ContractModule,
    StudentCurriculumModule
  ],
  exports: [
    StudentComponent,
    // StudentBasicComponent,
    StudentComplainBasicComponent,
  ],
  entryComponents: [
    StudentComponent,
    StudentBasicComponent,
    StudentAchievementsComponent,
    StudentAllocationDetailComponent,
    StudentBillsComponent,
    StudentContractsComponent,
    StudentContractPortletComponent,
    StudentFeedBacksComponent,
    StudentFollowsComponent,
    StudentSchedulesComponent,
    StudentTaskAfterClassComponent,
    StudentTeachLogComponent,
    StudentUseCurriculumComponent,
    StudentAchievementCheckComponent,
    StudentAchievementEditComponent,
    StudentChangeSchoolEditComponent,
    StudentFeedbackEditComponent,
    StudentFeedbackCheckComponent,
    StudentCcFollowEditComponent,
    StudentCcFollowsRecordsCheckComponent,
    StudentScFollowsEditComponent,
    StudentScheduleEditComponent,
    StudentTaskAfterClassEditComponent,
    StudentTeachLogsEditComponent,
    StudentUseCurriculumComponent,

    StudentComplainBasicFollowEditComponent,

    StudentContractLogsComponent,
    StudentContractPurchaseRecordComponent,
    StudentContractRefundRecordComponent,
    StudentContractExchangeRecordComponent,
    StudentContractRecordSubjectsComponent,
    StudentContractTranslationRecordComponent
  ],
  providers: [
    { provide: ContractDtoService, useClass: StudentContractService },
  ]
})
export class StudentModule { }
