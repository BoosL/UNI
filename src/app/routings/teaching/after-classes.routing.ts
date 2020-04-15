import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import {AfterClassesModule, AfterClassesComponent} from '../../_modules/after-classes/after-classes';

const routes: Routes = [
  { path: '', component: AfterClassesComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AfterClassesModule
  ],
  exports: [
    RouterModule
  ]
})
export class AfterClassesRouting { }
