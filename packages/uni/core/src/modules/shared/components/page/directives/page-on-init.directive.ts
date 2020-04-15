import { Directive, Inject, OnInit, Host, AfterContentInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BACKEND_THEME, BackendThemeComponent, PageContext } from '../../../../theme/theme.component';
import { IBackendPageComponent, BACKEND_PAGE } from '../interfaces/page.component';

@Directive({ selector: '[pageOnInit]' })
export class PageOnInitDirective implements OnInit, AfterViewInit {

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    @Inject(BACKEND_THEME) protected theme: BackendThemeComponent,
    @Inject(BACKEND_PAGE) protected page: IBackendPageComponent
  ) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.activatedRoute.data.subscribe(({ pageTitle, pageBreadcrumb, pageExtra }) => {
      const payload = {} as PageContext;
      payload.title = pageTitle || '';
      payload.breadcrumb = pageBreadcrumb || [];
      payload.extra = pageExtra || {};
      payload.headTpl = this.page.pageHeadTpl;
      payload.headButtonsTpl = this.page.pageHeadButtonsTpl;
      this.theme.handlePageBound(payload);
    });
  }

}
