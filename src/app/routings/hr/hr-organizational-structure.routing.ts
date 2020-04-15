import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HrModule, HrOrganizationsPageComponent } from 'src/app/_modules/hr/hr';

const routes: Routes = [
  { path: '', component: HrOrganizationsPageComponent },
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
export class HrOrganizationalStructureRoutingModule { }
