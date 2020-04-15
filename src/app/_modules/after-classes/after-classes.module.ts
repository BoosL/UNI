import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatRippleModule, MatIconModule, MatProgressSpinnerModule, MatButtonModule} from '@angular/material';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {NgxExcelModule} from 'ngx-excel';
import {BackendSharedModule} from '@uni/core';
// http-service
import {AfterClassesComponent} from './components/after-classes/after-classes.component';
import {ActTaskService, AfterClassesService} from './_services/after-classes.service';


const providers = [
  AfterClassesService,
  ActTaskService
]

@NgModule({
  declarations: [
    AfterClassesComponent

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
    AfterClassesComponent
  ],
  entryComponents: [
    AfterClassesComponent
  ],
  providers: [
    ...providers
  ]
})
export class AfterClassesModule {
}
