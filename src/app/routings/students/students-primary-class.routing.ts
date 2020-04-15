import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StudentsModule, StudentsPrimaryClassPageComponent, StudentPrimaryClassPageComponent } from '../../_modules/students/students';

const routes: Routes = [
  { path: '', component: StudentsPrimaryClassPageComponent },
  { path: ':studentId', component: StudentPrimaryClassPageComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    StudentsModule
  ],
  exports: [
    RouterModule,
  ]
})
export class SudentsPrimaryClassRoutingModule { }

