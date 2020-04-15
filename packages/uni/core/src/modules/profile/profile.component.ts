import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Renderer2,
  ComponentFactoryResolver,
  Injector,
  ComponentRef,
  forwardRef,
  OnDestroy
} from '@angular/core';
import { AuthService } from '@uni/common';
import { NzMessageService } from 'ng-zorro-antd';
import { EmployeeService, Employee } from '../../logic/logic';
import { map, filter } from 'rxjs/operators';
import { IBackendPageComponent, BACKEND_PAGE } from '../shared/components/page/interfaces/page.component';
import { BehaviorSubject, Subscription } from 'rxjs';
import { EmployeeRelativeOPComponent } from '../employee/components/employee-relative-o-p/employee-relative-o-p.component';
import { ProfileService } from './services/profile.service';

@Component({
  selector: 'backend-page.profile',
  templateUrl: './profile.component.html',
  providers: [
    { provide: BACKEND_PAGE, useExisting: forwardRef(() => ProfileComponent) },
    { provide: EmployeeService, useClass: ProfileService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent extends IBackendPageComponent implements OnInit, OnDestroy {

  employee$ = new BehaviorSubject<Employee>(null);
  externalEmployee$ = new BehaviorSubject<Employee>(null);

  layoutMenus = [
    { name: 'relative_o_p', label: '关联的组织职位', active: false, component: EmployeeRelativeOPComponent }
  ];

  private _componentSubscription = new Subscription();

  constructor(
    protected renderer2: Renderer2,
    protected injector: Injector,
    protected cfr: ComponentFactoryResolver,
    protected message: NzMessageService,
    protected authService: AuthService,
    protected employeeService: EmployeeService
  ) {
    super(renderer2, injector, cfr);
  }

  ngOnInit() {
    super.ngOnInit();
    const reloadSubscription = this.authService.getAuthSubject().pipe(
      filter((logined) => !!logined),
      map(() => this.employeeService.createModel(null, this.authService.getCurrentUser()))
    ).subscribe(
      (employee) => {
        this.employee$.next(employee);
        this.externalEmployee$.next(employee);
      },
      (e) => this.message.error(e.message || '系统错误，请联系管理员')
    );
    this._componentSubscription.add(reloadSubscription);
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  /**
   * 当员工信息变更后通知其他组件
   * @param employee 变更后的员工信息
   */
  handleEmployeeChange(employee: Employee) {
    this.employee$.next(employee);
  }

  /**
   * 绑定员工关联组织职位的组件参数
   * @param component 原组件
   */
  protected createRelativeOPComponent(component: ComponentRef<EmployeeRelativeOPComponent>) {
    component.instance.employee$ = this.externalEmployee$;
    return component;
  }

}
