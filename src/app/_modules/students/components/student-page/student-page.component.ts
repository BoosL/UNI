import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Renderer2,
  Injector,
  ComponentFactoryResolver,
  forwardRef,
  OnDestroy
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService, NzDrawerService } from 'ng-zorro-antd';
import {
  BACKEND_PAGE,
  IBackendPageComponent,
  SchoolMenuService,
  StudentService
} from '@uni/core';
import { Subscription, Observable } from 'rxjs';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';
import {
  // 申请转校
  // StudentChangeSchoolEditComponent,
  // 学员课程管理 暂不迁移
  // StudentCurriculumsComponent
} from '@uni/student';

@Component({
  selector: 'backend-page.student',
  templateUrl: './student-page.component.html',
  providers: [
    { provide: BACKEND_PAGE, useExisting: forwardRef(() => StudentPageComponent) }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentPageComponent extends IBackendPageComponent implements OnInit, OnDestroy {

  studentId$: Observable<string>;

  // tslint:disable: variable-name
  private _currentSchoolId = '';
  private _componentSubscription = new Subscription();

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected renderer2: Renderer2,
    protected injector: Injector,
    protected cfr: ComponentFactoryResolver,
    protected message: NzMessageService,
    protected schoolMenuService: SchoolMenuService,
    protected studentService: StudentService,
    protected drawer: NzDrawerService
  ) {
    super(renderer2, injector, cfr);
  }

  ngOnInit() {
    this.studentId$ = this.activatedRoute.params.pipe(
      map((params) => params.studentId),
      distinctUntilChanged()
    );
    // 当切换校区时跳转回列表
    this._currentSchoolId = this.schoolMenuService.currentSchool.id;
    const currentSchoolChangeSubscription = this.schoolMenuService.currentSchool$.pipe(
      map((currentSchool) => currentSchool.id),
      filter((currentSchoolId) => currentSchoolId !== this._currentSchoolId)
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

  /**
   * 当申请转校被点击时执行
   * @param e 事件
   */
  // handleSchoolTransitionClick(e: Event) {
  //   const componentFactory = this.cfr.resolveComponentFactory(SchoolTransitionDialogComponent);
  //   const componentInjector = Injector.create({ providers: [], parent: this.injector });
  //   // const componentInjector = ReflectiveInjector.resolveAndCreate([], this.injector);
  //   const componentRef = componentFactory.create(componentInjector);
  //   componentRef.instance.student = this.context;
  //   this.application.dialog(componentRef).result.then((reloadSignal) => {
  //     if (!reloadSignal) { return; }
  //     this.application.success('转校申请已成功提交，请耐心等待审核...');
  //     const primaryKey = this.excel.getPrimaryKey(this.context);
  //     this.excel.getModel(primaryKey).subscribe((context) => {
  //       this.context = context;
  //       this.modelMenus.forEach((modelMenu) => {
  //         if (!modelMenu.componentRef) { return; }
  //         modelMenu.componentRef.instance['context'] = this.context;
  //         modelMenu.componentRef.instance.reload();
  //       });
  //     }, () => this.application.error('页面更新失败'));
  //   }, () => { });
  // }


  /**
   * 当申请转校被点击时执行
   * @param e 事件
   */
  // handleSchoolTransitionClick = ({ context }: { context: Student }) => {
  //   if (!this.student$) { return; }
  //   const drawerRef = this.drawer.create<StudentChangeSchoolEditComponent, {
  //   }, Student>({
  //     nzWidth: '30%',
  //     nzBodyStyle: { height: '100%', overflow: 'auto', padding: '0 0 54px 0' },
  //     nzContent: StudentChangeSchoolEditComponent,
  //     nzContentParams: {},
  //   });
  //   return drawerRef.afterClose.pipe(
  //     filter((studentAchievement) => !!studentAchievement),
  //     map((studentAchievement) => [{ action: 'append', contexts: studentAchievement }])
  //   );
  // }





}
