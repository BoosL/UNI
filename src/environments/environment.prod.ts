import { IBackendConfig } from '@uni/core';

export const environment: IBackendConfig = {
  production: false,
  name: '百弗英语Uni',
  moduleName: 'teaching',
  routes: [
    {
      path: 'curriculum-schedules',
      loadChildren: () => import('../app/routings/teaching/curriculum-schedules.routing')
        .then(module => module.CurriculumSchedulesRouting),
      data: {
        pageTitle: '排课管理',
        pageBreadcrumb: [{ label: '教学管理' }]
      }
    }, {
      path: 'after-classes',
      loadChildren: () => import('../app/routings/teaching/after-classes.routing')
        .then(module => module.AfterClassesRouting),
      data: {
        pageTitle: '课后作业',
        pageBreadcrumb: [{ label: '教学管理' }]
      }
    }, {
      path: 'achievements',
      loadChildren: () => import('../app/routings/teaching/achievements.routing')
        .then(module => module.AchievementsRoutingModule),
      data: {
        pageTitle: '成绩管理',
        pageBreadcrumb: [{ label: '教学管理' }]
      }
    }, {
      path: 'students',
      loadChildren: () => import('../app/routings/teaching/students.routing')
        .then(module => module.SudentsRoutingModule),
      data: {
        pageTitle: '学员列表',
        pageBreadcrumb: [{ label: '教学管理' }, { label: '学员管理' }]
      }
    }, {
      path: 'vip_classes',
      loadChildren: () => import('../app/routings/students/students-primary-class.routing')
        .then(module => module.SudentsPrimaryClassRoutingModule),
      data: {
        pageTitle: '小班列表',
        pageBreadcrumb: [{ label: '教学管理' }, { label: '学员管理' }]
      }
    }, {
      path: 'teachers',
      loadChildren: () => import('../app/routings/teaching/teachers.routing')
        .then(module => module.TeachersRoutingModule),
      data: {
        pageTitle: '全部老师',
        pageBreadcrumb: [{ label: '教学管理' }, { label: '老师管理' }]
      }
    }, {
      path: 'teacher-schedules',
      loadChildren: () => import('../app/routings/teaching/teacher-schedules.routing')
        .then(module => module.TeacherSchedulesRoutingModule),
      data: {
        pageTitle: '老师时间管理',
        pageBreadcrumb: [{ label: '教学管理' }, { label: '老师管理' }]
      }
    }, {
      path: 'complaints',
      loadChildren: () => import('../app/routings/students/students-complain.routing')
        .then(module => module.SudentsComplainRoutingModule),
      data: {
        pageTitle: '学员投诉',
        pageBreadcrumb: [{ label: '教学管理' }]
      }
    }, {
      path: 'logs',
      loadChildren: () => import('../app/routings/teaching/teaching-diaries.routing')
        .then(module => module.TeachingDiariesRouting),
      data: {
        pageTitle: '教学日志',
        pageBreadcrumb: [{ label: '教学日志' }]
      }
    }
  ],

  WebApiConfig: {
    gatewayUrl: '/api',
    // tslint:disable-next-line: object-literal-key-quotes
    requestHeaders: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    debug: false
  },

  AuthConfig: {
    loginUrl: 'passports/_login',
    logoutUrl: 'passports/_logout',
    refreshUrl: 'passports/_refresh',
    useServerTokenDomain: true
  }
};
