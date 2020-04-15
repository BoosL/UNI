import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NgxExcelModule } from 'ngx-excel';
import { BackendSharedModule } from '@uni/core';

import { OrganizationTreeComponent } from './components/organization-tree/organization-tree.component';
import { OrganizationGraphComponent } from './components/organization-graph/organization-graph.component';
import { EmployeesComponent } from './components/employees/employees.component';

import { HrEmployeesPageComponent } from './components/hr-employees-page/hr-employees-page.component';
import { HrOrganizationsPageComponent } from './components/hr-organizations-page/hr-organizations-page.component';
import { HrPositionsPageComponent } from './components/hr-positions-page/hr-positions-page.component';
import { HrPositionsEditComponent } from './components/hr-positions-edit/hr-positions-edit.component';

@NgModule({
  declarations: [
    OrganizationTreeComponent,
    OrganizationGraphComponent,
    EmployeesComponent,

    HrOrganizationsPageComponent,
    HrPositionsPageComponent,
    HrPositionsEditComponent,
    HrEmployeesPageComponent,
    HrOrganizationsPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgZorroAntdModule,
    NgxGraphModule,
    NgxExcelModule,
    BackendSharedModule,
    MatRippleModule
  ],
  exports: [
    HrEmployeesPageComponent,
    HrPositionsPageComponent,
    HrOrganizationsPageComponent,
  ],
  entryComponents: [
    EmployeesComponent,
    HrPositionsEditComponent
  ],
})
export class HrModule { }
