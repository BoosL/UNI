import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  MatIconModule,
  MatButtonModule,
  MatToolbarModule,
  MatSidenavModule,
  MatRippleModule,
  MatMenuModule,
  MatSnackBarModule
} from '@angular/material';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { WebApiModule } from '@uni/common';
import { BackendSharedModule } from '../shared/shared.module';

import { SchoolMenusComponent } from './components/school-menus/school-menus.component';
import { EmployeeMenusComponent } from './components/employee-menus/employee-menus.component';
import { QuickLinksComponent } from './components/quick-links/quick-links.component';
import { UserMenusComponent } from './components/user-menus/user-menus.component';
import { BackendMenusComponent } from './components/menus/menus.component';
import { ChromeStatsComponent } from './components/chrome-stats/chrome-stats.component';

import { BackendThemeComponent } from './theme.component';
import { MenuService } from './services/menu.service';
import { QuickLinksService } from './services/quick-links.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatRippleModule,
    MatMenuModule,
    MatSnackBarModule,
    NgZorroAntdModule,
    WebApiModule,
    PerfectScrollbarModule,
    BackendSharedModule
  ],
  exports: [],
  declarations: [
    SchoolMenusComponent,
    EmployeeMenusComponent,
    QuickLinksComponent,
    UserMenusComponent,
    BackendMenusComponent,
    ChromeStatsComponent,
    BackendThemeComponent
  ],
  providers: [
    MenuService,
    QuickLinksService
  ],
})
export class BackendThemeModule { }
