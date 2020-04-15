import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxExcelModule } from 'ngx-excel';
import { MatRippleModule } from '@angular/material';
import { BackendSharedModule } from '@uni/core';
import { CustomerModule } from '@uni/customer';
import { TmkCustomersMigrateComponent } from './components/tmk-customers-migrate/tmk-customers-migrate.component';
import { TmkCustomersComponent } from './components/tmk-customers/tmk-customers.component';
import { TmkEmployeeSourcesManagerComponent } from './components/tmk-employee-sources-manager/tmk-employee-sources-manager.component';
import { TmkEmployeesSearchComponent } from './components/tmk-employees-search/tmk-employees-search.component';
import { TmkEmployeesPageComponent } from './components/tmk-employees-page/tmk-employees-page.component';
import { TmkCustomerPageComponent } from './components/tmk-customer-page/tmk-customer-page.component';
import { TmkCustomersPageComponent } from './components/tmk-customers-page/tmk-customers-page.component';
import {
  TmkCustomerFollowRecordEditComponent
} from './components/tmk-customer-follow-recode-edit/tmk-customer-follow-record-edit.component';
import { TmkCustomerStatsComponent } from './components/tmk-customer-stats/tmk-customer-stats.component';
import { TmkCustomersSearchComponent } from './components/tmk-customers-search/tmk-customers-search.component';
import { TmkCustomersCommunalPageComponent } from './components/tmk-customers-communal-page/tmk-customers-communal-pool-page.component';
import { TmkCustomersCommunalSearchComponent } from './components/tmk-customers-communal-search/tmk-customers-communal-search.component';
import { TmkCustomersCommunalMigrateComponent } from './components/tmk-customers-communal-migrate/tmk-customers-communal-migrate.component';
import {TmkCustomerComponent} from './components/tmk-customer/tmk-customer.component';

@NgModule({
  declarations: [
    TmkCustomersPageComponent,
    TmkCustomerPageComponent,
    TmkCustomersComponent,
    TmkCustomerFollowRecordEditComponent,
    TmkCustomerStatsComponent,
    TmkCustomersSearchComponent,
    TmkCustomersMigrateComponent,
    TmkEmployeeSourcesManagerComponent,
    TmkEmployeesSearchComponent,
    TmkEmployeesPageComponent,
    TmkCustomersCommunalPageComponent,
    TmkCustomersCommunalSearchComponent,
    TmkCustomersCommunalMigrateComponent,
    TmkCustomerComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgZorroAntdModule,
    NgxExcelModule,
    CustomerModule,
    BackendSharedModule,
    MatRippleModule
  ],
  exports: [
    TmkCustomersPageComponent,
    TmkCustomerPageComponent,
    TmkEmployeesPageComponent,
    TmkCustomersCommunalPageComponent
  ],
  entryComponents: [
    TmkCustomersComponent,
    TmkCustomerFollowRecordEditComponent,
    TmkCustomerStatsComponent,
    TmkCustomersSearchComponent,
    TmkCustomersMigrateComponent,
    TmkEmployeeSourcesManagerComponent,
    TmkEmployeesSearchComponent,
    TmkCustomersCommunalSearchComponent,
    TmkCustomersCommunalMigrateComponent,
    TmkCustomerComponent
  ],
})
export class TmkModule { }
