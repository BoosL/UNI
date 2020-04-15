import {
  Component,
  OnInit,
  HostBinding,
  Inject,
  InjectionToken,
  forwardRef,
  ChangeDetectorRef,
  TemplateRef,
  ChangeDetectionStrategy,
  Optional
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@uni/common';
import { BACKEND_CONFIG, IBackendConfig } from '../../backend.config';
import { BACKEND_ROOT, BackendComponent } from '../../backend.component';
import { EmployeeService, Employee } from '../../logic/logic';
import { PreferencesService } from '../shared/services/preferences.service';
import { SchoolMenuService } from './services/school-menu.service';
import { EmployeeMenuService } from './services/employee-menu.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

export const BACKEND_THEME = new InjectionToken<BackendThemeComponent>('BackendThemeComponent');

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

export interface PageContext {
  title: string;
  breadcrumb: Array<{ label: string, url?: string }>;
  extra: any;
  headTpl: TemplateRef<any>;
  headButtonsTpl: TemplateRef<any>;
}

@Component({
  selector: 'backend-theme',
  templateUrl: './theme.component.html',
  providers: [
    { provide: BACKEND_THEME, useExisting: forwardRef(() => BackendThemeComponent) }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class BackendThemeComponent implements OnInit {

  readonly currentUser$: Observable<Employee> = this.authService.getAuthSubject().pipe(
    map((logined) => logined ? this.employeeService.createModel(null, this.authService.getCurrentUser()) : null)
  );

  readonly pageBound$ = new Subject<PageContext>();

  enabledViewFilters = false;

  @HostBinding('class.collapse') collapse = false;

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected cdr: ChangeDetectorRef,
    protected authService: AuthService,
    protected employeeService: EmployeeService,
    protected preferences: PreferencesService,
    @Inject(BACKEND_CONFIG) public appConfig: IBackendConfig,
    @Inject(BACKEND_ROOT) public root: BackendComponent,
    @Optional() protected schoolMenuService: SchoolMenuService,
    @Optional() protected employeeMenuService: EmployeeMenuService
  ) { }

  ngOnInit() {
    this.enabledViewFilters = !!this.schoolMenuService || !!this.employeeMenuService;
  }

  handlePageBound(payload: PageContext) {
    this.pageBound$.next(payload);
    if (payload.title) {
      this.root.setTitle(payload.title);
    }
    this.cdr.detectChanges();
  }

  /**
   * 切换菜单栏的可见状态
   * @param e 事件
   */
  toggleMenuBar(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    // this.collapse = this.preferences.set('Theme.MenuBarCollapse', !this.collapse);
  }

  /**
   * 返回控制面板
   */
  backToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
