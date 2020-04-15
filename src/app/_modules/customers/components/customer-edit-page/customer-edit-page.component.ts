import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  forwardRef,
  ComponentRef,
  Type,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  AfterViewInit, TemplateRef
} from '@angular/core';
import {
  BACKEND_PAGE
} from '@uni/core';
import { MarketingCustomer, CustomerEditComponent, CustomerFinderComponent } from '@uni/customer';
import { BaseCustomerWrapperComponent } from '../base-customer-wrapper-component';

@Component({
  selector: 'backend-page.customer-edit-page',
  templateUrl: './customer-edit-page.component.html',
  providers: [
    { provide: BACKEND_PAGE, useExisting: forwardRef(() => CustomerEditPageComponent) }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerEditPageComponent extends BaseCustomerWrapperComponent implements OnInit, OnDestroy, AfterViewInit {

  // tslint:disable: variable-name
  private _currentStepComponent: ComponentRef<any>;

  @ViewChild('containerSteps', { read: ViewContainerRef, static: false }) containerSteps: ViewContainerRef;
  @ViewChild('customerTpl', { read: TemplateRef, static: false }) customerTpl: TemplateRef<any> ;
  ngOnInit() {
    this.initSchemeConfig();
  }

  ngOnDestroy() {
    if (this._currentStepComponent) {
      this._currentStepComponent.destroy();
    }
  }

  ngAfterViewInit() {
    if (this._currentStepComponent) {
      this._currentStepComponent.destroy();
    }
    this._attachStepComponent(CustomerFinderComponent);
    // const customer = this.customerService.createModel();
    // customer.phone = '18602300494';
    // this._attachStepComponent(CustomerEditComponent, { customer });
  }

  /**
   * 当客户列表被点击时执行
   * @param e 事件
   */
  handleBackButtonClick(e: Event) {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  /**
   * 跳转到客户编辑
   * @param customer 当前客户
   */
  protected edit(customer: MarketingCustomer) {
    this._attachStepComponent(CustomerEditComponent, { customer });
  }

  /**
   * 附着当前步骤组件
   * @param component 组件对象类型
   */
  private _attachStepComponent(component: Type<any>, inputs?: { [name: string]: any }) {
    const factory = this.cfr.resolveComponentFactory(component);
    const componentRef = factory.create(this.injector);
    componentRef.instance.isPanel = true;
    if (inputs) {
      Object.keys(inputs).forEach((inputKey) => componentRef.instance[inputKey] = inputs[inputKey]);
    }
    if (component === CustomerFinderComponent) {
      componentRef.instance.schemeConfig = this.schemeConfig;
      componentRef.instance.portletTpl = this.customerTpl;
      componentRef.instance.actionButtonClick.subscribe(
        (e: any) => this.handleActionButtonClick(e)
      );
    } else if (component === CustomerEditComponent) {
      componentRef.instance.customerCancel.subscribe(
        () => this._attachStepComponent(CustomerFinderComponent)
      );
    }
    if (this._currentStepComponent) {
      this._currentStepComponent.destroy();
    }
    this._currentStepComponent = componentRef;
    this.containerSteps.insert(this._currentStepComponent.hostView);
    this.cdr.detectChanges();
  }

}
