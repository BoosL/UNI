import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {NgxExcelModule} from 'ngx-excel';
import {MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatRippleModule} from '@angular/material';
import {BackendSharedModule} from '@uni/core';
import {CustomerConsultingRecordComponent} from './components/customer-consulting-record/customer-consulting-record.component';
import {
  CustomerConsultingRecordAbandonComponent
} from './components/customer-consulting-record-abandon/customer-consulting-record-abandon.component';
import {CustomerBasicComponent} from './components/customer-basic/customer-basic.component';
import {CustomerEditComponent} from './components/customer-edit/customer-edit.component';
import {CustomerEditCcrnComponent} from './components/customer-edit-ccrn/customer-edit-ccrn.component';
import {CustomerVisitedRecordEditComponent} from './components/customer-visited-record-edit/customer-visited-record-edit.component';
import {CustomerFollowRecordAbandonComponent} from './components/customer-follow-record-abandon/customer-follow-record-abandon.component';
import {CustomerFollowRecordEditComponent} from './components/customer-follow-record-edit/customer-follow-record-edit.component';
import {CustomerSourceComponent} from './components/customer-source/customer-source.component';
import {CustomerRelationshipComponent} from './components/customer-relationship/customer-relationship.component';
import {CustomerStatusComponent} from './components/customer-status/customer-status.component';
import {CustomerVisitedRecordLeaveComponent} from './components/customer-visited-record-leave/customer-visited-record-leave.component';
import {
  CustomerTimelineAddRecordComponent,
  CustomerTimelineCommonRecordComponent,
  CustomerTimelineCompatibleFollowRecordComponent,
  CustomerTimelineConsultingRecordComponent,
  CustomerTimelineEmployeeTransferredRecordComponent,
  CustomerTimelineFollowRecordComponent,
  CustomerTimelineReservedRecordComponent,
  CustomerTimelineVisitedRecordComponent,
  CustomerTimelineTmkFollowRecordComponent
} from './components/customer-timeline/customer-timeline';
import {CustomerInfoComponent} from './components/customer-info/customer-info.component';
import {CustomerTimelineComponent} from './components/customer-timeline/customer-timeline.component';
import {CustomerVersionsComponent} from './components/customer-versions/customer-versions.component';
import {CustomerComponent} from './components/customer/customer.component';
import {CustomerFinderComponent} from './components/customer-finder/customer-finder.component';
import {CustomersComponent} from './components/customers/customers.component';


@NgModule({
  declarations: [
    CustomerConsultingRecordComponent,
    CustomerConsultingRecordAbandonComponent,
    CustomerBasicComponent,
    CustomerEditComponent,
    CustomerEditCcrnComponent,
    CustomerVisitedRecordEditComponent,
    CustomerFollowRecordAbandonComponent,
    CustomerFollowRecordEditComponent,
    CustomerRelationshipComponent,
    CustomerSourceComponent,
    CustomerStatusComponent,
    CustomerVisitedRecordLeaveComponent,
    CustomerTimelineAddRecordComponent,
    CustomerTimelineCommonRecordComponent,
    CustomerTimelineCompatibleFollowRecordComponent,
    CustomerTimelineConsultingRecordComponent,
    CustomerTimelineEmployeeTransferredRecordComponent,
    CustomerTimelineFollowRecordComponent,
    CustomerTimelineReservedRecordComponent,
    CustomerTimelineVisitedRecordComponent,
    CustomerTimelineTmkFollowRecordComponent,
    CustomerInfoComponent,
    CustomerTimelineComponent,
    CustomerVersionsComponent,
    CustomerComponent,
    CustomerFinderComponent,
    CustomersComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgZorroAntdModule,
    NgxExcelModule,
    BackendSharedModule,
    MatRippleModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  exports: [
    CustomerConsultingRecordComponent,
    CustomerConsultingRecordAbandonComponent,
    CustomerBasicComponent,
    CustomerRelationshipComponent,
    CustomerSourceComponent,
    CustomerStatusComponent,
    CustomerFinderComponent,
    CustomerComponent,
    CustomersComponent
  ],
  entryComponents: [
    CustomerEditCcrnComponent,
    CustomerEditComponent,
    CustomerVisitedRecordEditComponent,
    CustomerConsultingRecordAbandonComponent,
    CustomerFollowRecordAbandonComponent,
    CustomerFollowRecordEditComponent,
    CustomerVisitedRecordLeaveComponent,
    CustomerTimelineAddRecordComponent,
    CustomerTimelineCommonRecordComponent,
    CustomerTimelineCompatibleFollowRecordComponent,
    CustomerTimelineConsultingRecordComponent,
    CustomerTimelineEmployeeTransferredRecordComponent,
    CustomerTimelineFollowRecordComponent,
    CustomerTimelineReservedRecordComponent,
    CustomerTimelineVisitedRecordComponent,
    CustomerTimelineTmkFollowRecordComponent,
    CustomerInfoComponent,
    CustomerVersionsComponent,
    CustomerComponent,
    CustomerFinderComponent,
    CustomerTimelineComponent
  ]
})
export class CustomerModule {}
