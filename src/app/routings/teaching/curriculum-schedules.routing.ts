import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  CurriculumSchedulesModule,
  CurriculumSchedulesPageComponent} from '../../_modules/curriculum-schedules/curriculum-schedules';


const routes: Routes = [
  { path: '', component: CurriculumSchedulesPageComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CurriculumSchedulesModule
  ],
  exports: [
    RouterModule
  ]
})
export class CurriculumSchedulesRouting {}
