import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackendSharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    BackendSharedModule
  ],
  declarations: [
    DashboardComponent
  ],
  entryComponents: [
    DashboardComponent
  ]
})
export class DashboardModule { }
