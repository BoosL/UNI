import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TeacherSchedulesModule, TeacherSchedulesComponent } from 'src/app/_modules/teacher-schedules/teacher-schedules';

const routes: Routes = [
  { path: '', component: TeacherSchedulesComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TeacherSchedulesModule
  ],
  exports: [
    RouterModule
  ]
})
export class TeacherSchedulesRoutingModule { }
