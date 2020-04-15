import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HrEmployeesPageComponent, HrModule } from 'src/app/_modules/hr/hr';

const routes: Routes = [
  { path: '', component: HrEmployeesPageComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HrModule
  ],
  exports: [
    RouterModule
  ]
})
export class HrEmployeesRoutingModule { }
