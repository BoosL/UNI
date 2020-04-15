import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  forwardRef,
  OnDestroy
} from '@angular/core';
import { BACKEND_PAGE } from '@uni/core';
import { BaseCustomerWrapperComponent } from '../base-customer-wrapper-component';
import { Observable, Subscription } from 'rxjs';
import { map, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'backend-page.customer',
  templateUrl: './customer-page.component.html',
  providers: [
    { provide: BACKEND_PAGE, useExisting: forwardRef(() => CustomerPageComponent) }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerPageComponent extends BaseCustomerWrapperComponent implements OnInit, OnDestroy {

  customerId$: Observable<string>;

  // tslint:disable: variable-name
  private _currentSchoolId = '';
  private _componentSubscription = new Subscription();

  ngOnInit() {
    this.initSchemeConfig();
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
