import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TmkEmployeesPageComponent, TmkModule } from 'src/app/_modules/tmk/tmk';

const routes: Routes = [
  { path: '', component: TmkEmployeesPageComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TmkModule
  ],
  exports: [
    RouterModule
  ]
})
export class TmkEmployeesRoutingModule { }
