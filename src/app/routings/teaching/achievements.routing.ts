import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import {AchievementsComponent, AchievementsModule} from 'src/app/_modules/achievements/achievements';

const routes: Routes = [
  { path: '', component: AchievementsComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AchievementsModule
  ],
  exports: [
    RouterModule
  ]
})
export class AchievementsRoutingModule { }
