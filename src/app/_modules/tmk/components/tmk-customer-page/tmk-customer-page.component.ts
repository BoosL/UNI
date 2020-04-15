import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  forwardRef,
  OnDestroy, Renderer2, Injector, ComponentFactoryResolver, ChangeDetectorRef
} from '@angular/core';
import {
  BACKEND_PAGE,
  SchoolMenuService,
  IBackendPageComponent
} from '@uni/core';
import { Observable, Subscription } from 'rxjs';
import { map, distinctUntilChanged, filter } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { NzDrawerService, NzMessageService, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'backend-page.customer',
  templateUrl: './tmk-customer-page.component.html',
  providers: [
    { provide: BACKEND_PAGE, useExisting: forwardRef(() => TmkCustomerPageComponent) }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmkCustomerPageComponent extends IBackendPageComponent implements OnInit, OnDestroy {

  customerId$: Observable<string>;

  // tslint:disable: variable-name
  private _currentSchoolId = '';
  private _componentSubscription = new Subscription();

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected renderer2: Renderer2,
    protected injector: Injector,
    protected cfr: ComponentFactoryResolver,
    protected cdr: ChangeDetectorRef,
    protected message: NzMessageService,
    protected modal: NzModalService,
    protected drawer: NzDrawerService,
    protected schoolMenuService: SchoolMenuService,
  ) {
    super(renderer2, injector, cfr);
  }
  ngOnInit() {
    this.customerId$ = this.activatedRoute.params.pipe(
      map((params) => params.customerId),
      distinctUntilChanged()
    );
    // 当切换校区且不为不限制(-1)时跳转回列表
    this._currentSchoolId = this.schoolMenuService.currentSchool.id;
    const currentSchoolChangeSubscription = this.schoolMenuService.currentSchool$.pipe(
      map((currentSchool) => currentSchool.id),
      filter((currentSchoolId) => currentSchoolId !== '-1' && currentSchoolId !== this._currentSchoolId)
    ).subscribe(() => this.handleBackButtonClick());
    this._componentSubscription.add(currentSchoolChangeSubscription);
  }
  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }
  /**
   * 返回客户列表
   * @param e 事件
   */
  handleBackButtonClick(e?: Event) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

}
