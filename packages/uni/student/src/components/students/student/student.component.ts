import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  Renderer2,
  Injector,
  ComponentFactoryResolver,
  Optional,
  OnDestroy,
  ChangeDetectorRef,
  ComponentRef
} from '@angular/core';
import { NzDrawerRef, NzMessageService } from 'ng-zorro-antd';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { distinctUntilChanged, map, tap, mergeMap } from 'rxjs/operators';
import { IBackendPageComponent, SchoolMenuService } from '@uni/core';
import { CurriculumManagerComponent } from '@uni/student/curriculum';
import { StudentBasicComponent } from '../student-basic/student-basic.component';
import { StudentBillsComponent } from '../student-bills/student-bills.component';
import { StudentContractsComponent } from '../student-contracts/student-contracts/student-contracts.component';
import { StudentSchedulesComponent } from '../student-schedules/student-schedules/student-schedules.component';
import { StudentFollowsComponent } from '../student-follows/student-follows.component';
import { StudentTaskAfterClassComponent } from '../student-task-after-class/student-task-after-class/student-task-after-class.component';
import { StudentUseCurriculumComponent } from '../student-use-curriculums/student-use-curriculums.component';
import { StudentAchievementsComponent } from '../student-achievements/student-achievements/student-achievements.component';
import { StudentTeachLogComponent } from '../student-teach-log/student-teach-log/student-teach-log.component';
import { StudentFeedBacksComponent } from '../student-feedbacks/student-feedbacks/student-feedbacks.component';
import { StudentAllocationDetailComponent } from '../student-allocation-detail/student-allocation-detail.component';
import { StudentExt } from '../../../models/student-ext.model';
import { StudentExtService } from '../../../service/students/student-ext.service';
import { StudentContractLogsComponent } from '../student-contract-logs/student-contract-logs.component';


@Component({
  selector: 'student',
  templateUrl: './student.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentComponent extends IBackendPageComponent implements OnInit, OnDestroy {

  // student$: Observable<StudentExt>;
  student$ = new BehaviorSubject<StudentExt>(null);
  layoutMenus = [
    { name: 'info', label: '学员基础信息', active: false, component: StudentBasicComponent },
    { name: 'curriculum_manager', label: '学员课程管理', active: false, component: CurriculumManagerComponent },
    { name: 'bill', label: '学员账单列表', active: false, component: StudentBillsComponent },
    { name: 'contract', label: '学员合同列表', active: false, component: StudentContractsComponent },
    { name: 'contract_record', label: '操作记录', active: false, component: StudentContractLogsComponent },
    { name: 'management', label: '学员时间管理列表', active: false, component: StudentSchedulesComponent },
    { name: 'sc_follows', label: '学员跟进列表', active: false, component: StudentFollowsComponent },
    { name: 'task_after_class', label: '学员课下任务列表', active: false, component: StudentTaskAfterClassComponent },
    { name: 'use_curriculums', label: '学员已上课时列表', active: false, component: StudentUseCurriculumComponent },
    { name: 'achievements', label: '学员成绩列表', active: false, component: StudentAchievementsComponent },
    { name: 'teach_logs', label: '教学日志列表', active: false, component: StudentTeachLogComponent },
    { name: 'feedbacks', label: '学员反馈列表', active: false, component: StudentFeedBacksComponent },
    { name: 'allocation_detail', label: '学员分配明细列表', active: false, component: StudentAllocationDetailComponent },
  ];

  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();
  private _currentStudent: StudentExt = null;

  @Input() componentMode: 'portlet' | 'page';
  @Input() studentId$: Observable<string>;
  @Output() actionButtonClick = new EventEmitter();
  @HostBinding('class.layout') layoutClass: boolean;

  constructor(
    protected renderer2: Renderer2,
    protected injector: Injector,
    protected cfr: ComponentFactoryResolver,
    protected cdr: ChangeDetectorRef,
    protected message: NzMessageService,
    protected schoolMenuService: SchoolMenuService,
    protected studentExtService: StudentExtService,
    @Optional() protected drawerRef: NzDrawerRef
  ) {
    super(renderer2, injector, cfr);
  }

  ngOnInit() {
    this.componentMode = this.componentMode || 'page';
    this.layoutClass = this.componentMode === 'page';
    const reloadSubscription = this.studentId$.pipe(
      distinctUntilChanged(),
      map((studentId) => {
        const currentSchool = this.schoolMenuService.currentSchool;
        const schoolId = currentSchool ? currentSchool.id : '';
        return { studentId, schoolId };
      }),
      tap(() => this.message.loading('数据加载中，请稍候...')),
      mergeMap(({ studentId, schoolId }) => this.studentExtService.getModel(studentId, { schoolId })),
      tap(() => this.message.remove())
    ).subscribe(
      (student) => {
        this._currentStudent = student;
        this.student$.next(student);
        this.handleMenuClick(this.layoutMenus[0]);
        this.cdr.detectChanges();
      },
      (e) => this.message.error(e.message || '系统错误，请联系管理员')
    );
    this._componentSubscription.add(reloadSubscription);
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  /**
   * 点击页面方式打开时执行
   * @param e 事件
   */
  handleRedirectButtonClick(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    if (this.drawerRef) {
      this.drawerRef.close(this._currentStudent);
    }
  }

  /**
   * 绑定学员信息的组件参数
   * @param component 原组件
   */
  protected createInfoComponent(component: ComponentRef<StudentBasicComponent>) {
    component.instance.student$ = this.student$;
    // component.instance.studentChange.subscribe(
    //   (changedStudent: StudentExt) => this._studentSubject.next(changedStudent)
    // );
    return component;
  }

  /**
   * 绑定学员课程管理的组件参数
   * @param component 原组件
   */
  protected createCurriculumManagerComponent(component: ComponentRef<CurriculumManagerComponent>) {
    component.instance.student$ = this.student$;
    return component;
  }

  /**
   * 绑定学员账单的组件参数
   * @param component 原组件
   */
  protected createBillComponent(component: ComponentRef<StudentBillsComponent>) {
    component.instance.student$ = this.student$;
    return component;
  }

  /**
   * 绑定学员合同的组件参数
   * @param component 原组件
   */
  protected createContractComponent(component: ComponentRef<StudentContractsComponent>) {
    component.instance.student$ = this.student$;
    return component;
  }

  /**
   * 绑定学员时间管理的组件参数
   * @param component 原组件
   */
  protected createManagementComponent(component: ComponentRef<StudentSchedulesComponent>) {
    component.instance.student$ = this.student$;
    return component;
  }

  /**
   * 绑定学员已上课时的组件参数
   * @param component 原组件
   */
  protected createUseCurriculumsComponent(component: ComponentRef<StudentUseCurriculumComponent>) {
    component.instance.student$ = this.student$;
    return component;
  }

  /**
   * 绑定学员跟进的组件参数
   * @param component 原组件
   */
  protected createScFollowsComponent(component: ComponentRef<StudentFollowsComponent>) {
    component.instance.student$ = this.student$;
    return component;
  }

  /**
   * 绑定学员课下任务的组件参数
   * @param component 原组件
   */
  protected createTaskAfterClassComponent(component: ComponentRef<StudentTaskAfterClassComponent>) {
    component.instance.student$ = this.student$;
    return component;
  }


  /**
   * 绑定学员课下任务的组件参数
   * @param component 原组件
   */
  protected createAchievementsComponent(component: ComponentRef<StudentAchievementsComponent>) {
    component.instance.student$ = this.student$;
    return component;
  }

  /**
   * 绑定教学日志列表的组件参数
   * @param component 原组件
   */
  protected createTeachLogsComponent(component: ComponentRef<StudentTeachLogComponent>) {
    component.instance.student$ = this.student$;
    return component;
  }


  /**
   * 绑定学员反馈的组件参数
   * @param component 原组件
   */
  protected createFeedbacksComponent(component: ComponentRef<StudentFeedBacksComponent>) {
    component.instance.student$ = this.student$;
    return component;
  }

  /**
   * 绑定学员分配明细的组件参数
   * @param component 原组件
   */
  protected createAllocationDetailComponent(component: ComponentRef<StudentAllocationDetailComponent>) {
    component.instance.student$ = this.student$;
    return component;
  }

  /**
   * 绑定学员分配明细的组件参数
   * @param component 原组件
   */
  protected createContractRecordComponent(component: ComponentRef<StudentContractLogsComponent>) {
    component.instance.student$ = this.student$;
    return component;
  }

}
