import {
  Component,
  OnInit,
  Renderer2,
  ComponentFactoryResolver,
  Injector,
  ChangeDetectionStrategy,
  Input,
  Optional,
  HostBinding,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import {
  NgxExcelModelColumnRules,
  INgxExcelDataSource
} from 'ngx-excel';
import {IBackendPageComponent} from '@uni/core';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { NzMessageService, NzDrawerRef } from 'ng-zorro-antd';
import {distinctUntilChanged, tap, mergeMap} from 'rxjs/operators';

import { StudentsPrimaryClass, StudentPrimaryClassService } from '@uni/student';

@Component({
  selector: 'student-primary-class',
  templateUrl: './student-primary-class.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: StudentPrimaryClassService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentPrimaryClassComponent extends IBackendPageComponent implements OnInit, OnDestroy {

  rules: NgxExcelModelColumnRules<StudentsPrimaryClass>;
  student$ = new BehaviorSubject<StudentsPrimaryClass>(null);
  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();
  @Input() studentId$: Observable<string>;
  @Input() componentMode: 'portlet' | 'page';
  @HostBinding('class.layout') layoutClass: boolean;
  constructor(
    protected renderer2: Renderer2,
    protected injector: Injector,
    protected cfr: ComponentFactoryResolver,
    protected studentPrimaryClassService: StudentPrimaryClassService,
    protected message: NzMessageService,
    protected cdr: ChangeDetectorRef,
    @Optional() protected drawerRef: NzDrawerRef
  ) {
    super(renderer2, injector, cfr);
  }

  ngOnInit() {
    this.rules = this.studentPrimaryClassService.getRules();
    this.componentMode = this.componentMode || 'page';
    this.layoutClass = this.componentMode === 'page';
    const reloadSubscription = this.studentId$.pipe(
      distinctUntilChanged(),
      tap(() => this.message.loading('数据加载中，请稍候...')),
      mergeMap((studentId) => this.studentPrimaryClassService.getModel(studentId)),
      tap(() => this.message.remove())
    ).subscribe(
      (studentsPrimaryClass) => {
        this.student$.next(studentsPrimaryClass);
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
      this.drawerRef.close(true);
    }
  }
}
