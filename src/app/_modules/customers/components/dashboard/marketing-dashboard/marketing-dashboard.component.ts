import { Component, OnInit, ChangeDetectionStrategy, forwardRef, Renderer2, Injector, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { AuthService } from '@uni/common';
import { BACKEND_PAGE, EmployeeService, IBackendPageComponent } from '@uni/core';
import { UsDashboardComponent } from '../us-dashboard/us-dashboard.component';

@Component({
  selector: 'backend-page.dashboard',
  templateUrl: './marketing-dashboard.component.html',
  providers: [
    { provide: BACKEND_PAGE, useExisting: forwardRef(() => MarketingDashboardComponent) }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketingDashboardComponent extends IBackendPageComponent implements OnInit {

  currentRole: string;

  @ViewChild(UsDashboardComponent, { static: false }) dashboardComponent: UsDashboardComponent;

  constructor(
    protected renderer2: Renderer2,
    protected injector: Injector,
    protected cfr: ComponentFactoryResolver,
    protected authService: AuthService,
    protected employeeService: EmployeeService
  ) {
    super(renderer2, injector, cfr);
  }

  ngOnInit() {
    const employee = this.employeeService.createModel(null, this.authService.getCurrentUser());
    if (this.employeeService.isSourceRole(employee)) {
      this.currentRole = 'SO';
    } else if (this.employeeService.isUsherRole(employee)) {
      this.currentRole = 'US';
    } else if (this.employeeService.isCcRole(employee)) {
      this.currentRole = 'CC';
    } else {
      this.currentRole = '';
    }
  }

  /**
   * 当新增客户按钮被点击时执行（事件透传）
   * @param e 事件
   */
  handleAddButtonClick(e: Event) {
    if (this.dashboardComponent) {
      this.dashboardComponent.handleAddButtonClick(e);
    } else {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  /**
   * 当客户到访按钮被点击时执行（事件透传）
   * @param e 事件
   */
  handleAppendVisitedRecordButtonClick(e: Event) {
    if (this.dashboardComponent) {
      this.dashboardComponent.handleAppendVisitedRecordButtonClick(e);
    } else {
      e.stopPropagation();
      e.preventDefault();
    }
  }

}
