import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TeachersModule, TeachersComponent } from 'src/app/_modules/teachers/teachers';

const routes: Routes = [
  { path: '', component: TeachersComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TeachersModule
  ],
  exports: [
    RouterModule
  ]
})
export class TeachersRoutingModule {}

