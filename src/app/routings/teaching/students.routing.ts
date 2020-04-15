import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StudentsModule, StudentsPageComponent, StudentPageComponent  } from '../../_modules/students/students';

const routes: Routes = [
  { path: '', component: StudentsPageComponent },
  { path: ':studentId', component: StudentPageComponent }
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
export class SudentsRoutingModule { }

