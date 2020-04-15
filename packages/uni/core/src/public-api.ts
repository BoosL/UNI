/*
 * Public API Surface of core
 */

// BackendModule

export * from './logic/logic';

export * from './models/select-option.model';
export * from './models/upload-file.model';
export * from './services/backend.service';
export * from './services/base.service';
export * from './backend.config';
export * from './backend.component';
export * from './backend.helpers';
export * from './backend.module';

// BackendThemeModule
export * from './modules/theme/models/menu-group.model';
export * from './modules/theme/models/menu.model';
export * from './modules/theme/models/school-menu.model';
export * from './modules/theme/services/menu.service';
export * from './modules/theme/services/school-menu.service';
export * from './modules/theme/services/employee-menu.service';
export * from './modules/theme/theme.component';

// SharedModule
export * from './modules/shared/pipes/strip-chinese.pipe';
export * from './modules/shared/components/page/page';
export * from './modules/shared/components/alert-bar/alert-bar';
export * from './modules/shared/components/portlet/portlet';
export * from './modules/shared/components/page/interfaces/page.component';
export * from './modules/shared/services/preferences.service';
export * from './modules/shared/shared.module';

// BackendDashboardModule
export * from './modules/dashboard/dashboard.component';
export * from './modules/dashboard/dashboard.module';
