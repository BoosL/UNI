import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxExcelModule } from 'ngx-excel';
import { BackendSharedModule } from '@uni/core';
import { TeachersComponent } from './components/teachers/teachers.component';

@NgModule({
  declarations: [
    TeachersComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    NgZorroAntdModule,
    NgxExcelModule,
    BackendSharedModule
  ],
  exports: [
    TeachersComponent
  ]
})
export class TeachersModule {}
