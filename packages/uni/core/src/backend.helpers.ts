import { Routes, Route, ChildActivationEnd } from '@angular/router';
import { AuthGuard } from '@uni/common';
import { BackendThemeComponent } from './modules/theme/theme.component';
import { BackendService } from './services/backend.service';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { ScheduleComponent } from './modules/schedule/components/schedule/schedule.component';
import { BackendPassportComponent } from './modules/passport/components/passport/passport.component';

function resolveBackendRoute(originalRoute: Route): Route {
  const route = Object.assign({}, originalRoute);
  // 如果定义了懒加载或有子路由则不进行转换
  if (route.loadChildren) {
    return route;
  }

  if (route.children) {
    route.children = route.children.map((child) => resolveBackendRoute(child));
    return route;
  }

  route.data = route.data || {};
  if (route.component) {
    route.loadChildren = '~@uni/core/page.module#BackendPageModule';
    route.data.component = route.component;
    delete route.component;
  }

  return route;
}

export function createRoutes(routes: Routes): Routes {
  return [
    { path: 'login', component: BackendPassportComponent },
    {
      path: '',
      canActivate: [
        AuthGuard
      ],
      component: BackendThemeComponent,
      children: [
        {
          path: 'profile',
          component: ProfileComponent,
          data: { pageTitle: '个人资料', pageBreadcrumb: [{ label: '个人中心' }] }
        },
        {
          path: 'schedule',
          component: ScheduleComponent,
          data: { pageTitle: '排班出勤', pageBreadcrumb: [{ label: '个人中心' }] }
        },
        ...routes,
        {
          path: 'dashboard',
          component: DashboardComponent,
          data: { pageTitle: '控制面板' }
        },
        { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
      ]
    }
  ];
}

export function initial(backendService: BackendService): () => Promise<boolean> {
  return () => backendService.loadConfig().toPromise();
}
