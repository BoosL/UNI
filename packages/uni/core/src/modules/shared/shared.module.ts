import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatRippleModule, MatIconModule } from '@angular/material';
import { NzIconModule, NzAlertModule } from 'ng-zorro-antd';
import {
  LayoutMainComponent,
  LayoutSubComponent,
  LayoutBlockDirective,
  PageOnInitDirective,
  PageHeadDirective,
  PageHeadButtonsDirective
} from './components/page/page';
import {
  AlertBarComponent,
  AlertBarBodyDirective
} from './components/alert-bar/alert-bar';
import {
  PortletComponent,
  PortletHeadDirective,
  PortletBodyDirective,
  PortletFootDirective
} from './components/portlet/portlet';

import { StripChinesePipe } from './pipes/strip-chinese.pipe';

const allComponents = [
  LayoutMainComponent,
  LayoutSubComponent,
  LayoutBlockDirective,
  PageOnInitDirective,
  PageHeadDirective,
  PageHeadButtonsDirective,

  AlertBarComponent,
  AlertBarBodyDirective,

  PortletComponent,
  PortletHeadDirective,
  PortletBodyDirective,
  PortletFootDirective
];

const allPipes = [
  StripChinesePipe
];

@NgModule({
  declarations: [
    ...allComponents,
    ...allPipes
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatRippleModule,
    NzIconModule,
    NzAlertModule,
  ],
  exports: [
    ...allComponents,
    ...allPipes
  ],
  providers: [],
})
export class BackendSharedModule {}
