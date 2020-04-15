import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material';
import {
  NzRateModule,
  NzCardModule,
  NzGridModule,
  NzAvatarModule,
  NzBadgeModule,
  NzTypographyModule
} from 'ng-zorro-antd';
import { NgxExcelModule } from 'ngx-excel';
import { BackendSharedModule } from '../shared/shared.module';
import { EmployeeBasicComponent } from './components/employee-basic/employee-basic.component';
import { EmployeeRelativeOPComponent } from './components/employee-relative-o-p/employee-relative-o-p.component';
import { EmployeeComponent } from './components/employee/employee.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatRippleModule,
    NzTypographyModule,
    NzRateModule,
    NzGridModule,
    NzCardModule,
    NzAvatarModule,
    NzBadgeModule,
    NgxExcelModule,
    BackendSharedModule
  ],
  declarations: [
    EmployeeBasicComponent,
    EmployeeRelativeOPComponent,
    EmployeeComponent
  ],
  exports: [
    EmployeeBasicComponent,
    EmployeeRelativeOPComponent
  ],
  providers: [ ],
  entryComponents: [
    EmployeeBasicComponent,
    EmployeeRelativeOPComponent
  ]
})
export class EmployeeModule {}
