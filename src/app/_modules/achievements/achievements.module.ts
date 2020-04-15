import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule, MatIconModule, MatProgressSpinnerModule, MatButtonModule } from '@angular/material';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxExcelModule } from 'ngx-excel';
import {BackendSharedModule} from '@uni/core';
import {ContextMenuModule} from 'ngx-contextmenu';
// http-service
import {AchievementsComponent} from './components/achievements/achievements.component';
import {AchievementsService, AchievementSubjectService} from './_services/achievements.service';
import {AchievementComponent} from './components/achievement/achievement.component';
import {AchievementSubjectOptionDataService} from './services/achievement-subject-option-data.service';
import {AchievementSubjectOptionComponent} from './components/achievement-subject-option/achievement-subject-option.component';
// component


const providers = [
  AchievementsService,
  AchievementSubjectService,
  AchievementSubjectOptionDataService
]

@NgModule({
  declarations: [
    AchievementsComponent,
    AchievementComponent,
    AchievementSubjectOptionComponent

  ],
  imports: [
    CommonModule,
    RouterModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    MatRippleModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NgZorroAntdModule,
    NgxExcelModule,
    BackendSharedModule,
  ],
  exports: [
    AchievementsComponent
  ],
  entryComponents: [
    AchievementsComponent,
    AchievementComponent,
    AchievementSubjectOptionComponent
  ],
  providers: [
    ...providers
  ]
})
export class AchievementsModule {}
