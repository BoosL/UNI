import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StudentsModule, StudentsComplainPageComponent, StudentComplainPageComponent  } from '../../_modules/students/students';

const routes: Routes = [
  { path: '', component: StudentsComplainPageComponent },
  { path: ':studentId', component: StudentComplainPageComponent },
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
export class SudentsComplainRoutingModule { }

