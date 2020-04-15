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
import { NzMessageService } from 'ng-zorro-antd';
import {
  BACKEND_PAGE,
  IBackendPageComponent,
  SchoolMenuService,
} from '@uni/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { mergeMap, tap, map, filter, distinctUntilChanged } from 'rxjs/operators';
import { INgxExcelDataSource } from 'ngx-excel';
import { StudentComplainService, StudentComplain } from '@uni/student';


@Component({
  selector: 'backend-page.student-complain',
  templateUrl: './student-complain-page.component.html',
  providers: [
    { provide: BACKEND_PAGE, useExisting: forwardRef(() => StudentComplainPageComponent) },
    { provide: INgxExcelDataSource, useExisting: StudentComplainService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentComplainPageComponent extends IBackendPageComponent implements OnInit, OnDestroy {

  student$ = new BehaviorSubject<StudentComplain>(null);


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
    protected studentComplainService: StudentComplainService,
  ) {
    super(renderer2, injector, cfr);
  }

  ngOnInit() {
    console.log(this.schoolMenuService, 'id');
    this._currentSchoolId = this.schoolMenuService.currentSchool.id;
    // 当切换校区时跳转回列表
    const currentSchoolChangeSubscription = this.schoolMenuService.currentSchool$.pipe(
      map((currentSchool) => currentSchool.id),
      filter((currentSchoolId) => currentSchoolId !== this._currentSchoolId)
    ).subscribe(
      () => this.router.navigate(['../'], { relativeTo: this.activatedRoute })
    );
    this._componentSubscription.add(currentSchoolChangeSubscription);

    const reloadSubscription = this.activatedRoute.params.pipe(
      map((params) => params.studentId),
      distinctUntilChanged(),
      map((studentId) => ({ studentId, schoolId: this._currentSchoolId })),
      tap(() => this.message.loading('数据加载中，请稍候...')),
      mergeMap(({ studentId }) => this.studentComplainService.getModel(studentId)),
      tap(() => this.message.remove())
    ).subscribe(
      (studentPrimaryClass) => this.student$.next(studentPrimaryClass),
      (e) => this.message.error(e.message || '系统错误，请联系管理员')
    );
    this._componentSubscription.add(reloadSubscription);
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }






}
