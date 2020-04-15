import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NzMessageModule,
  NzTypographyModule,
  NzCardModule,
  NzAvatarModule,
  NzBadgeModule
} from 'ng-zorro-antd';
import { WebApiModule } from '@uni/common';
import { BackendSharedModule } from '../shared/shared.module';
import { EmployeeModule } from '../employee/employee.module';
import { ProfileService } from './services/profile.service';
import { ProfileComponentService } from './services/profile-component.service';
import { ProfileComponent } from './profile.component';

@NgModule({
  imports: [
    CommonModule,
    NzMessageModule,
    NzTypographyModule,
    NzCardModule,
    NzAvatarModule,
    NzBadgeModule,
    WebApiModule,
    BackendSharedModule,
    EmployeeModule
  ],
  declarations: [
    ProfileComponent
  ],
  providers: [
    ProfileService,
    ProfileComponentService
  ],
})
export class ProfileModule { }
