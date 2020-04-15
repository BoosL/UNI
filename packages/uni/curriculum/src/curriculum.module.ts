import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule, MatProgressSpinnerModule } from '@angular/material';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxExcelModule } from 'ngx-excel';
import { BackendSharedModule } from '@uni/core';
import { CurriculumManagerComponent } from './components/curriculum-manager/curriculum-manager.component';
import { ProductTreeComponent } from './components/product-tree/product-tree.component';
import { CurriculumsComponent } from './components/curriculums/curriculums.component';
import { CurriculumTableComponent } from './components/components';

@NgModule({
  declarations: [
    CurriculumTableComponent,
    CurriculumManagerComponent,
    ProductTreeComponent,
    CurriculumsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgZorroAntdModule,
    NgxExcelModule,
    BackendSharedModule,
  ],
  exports: [
    CurriculumTableComponent,
    CurriculumManagerComponent
  ],
  entryComponents: [
    CurriculumTableComponent,
    ProductTreeComponent,
    CurriculumsComponent
  ],
})
export class CurriculumModule {
}
