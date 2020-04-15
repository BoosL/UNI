import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import {TeachingDiariesComponent} from '../../_modules/teaching-diaries/components/teaching-diaries/teaching-diaries.component';
import {TeachingDiariesModule} from '../../_modules/teaching-diaries/teaching-diaries.module';

const routes: Routes = [
  { path: '', component: TeachingDiariesComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TeachingDiariesModule
  ],
  exports: [
    RouterModule
  ]
})
export class TeachingDiariesRouting { }
