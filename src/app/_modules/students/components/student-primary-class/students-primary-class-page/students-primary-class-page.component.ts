import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  forwardRef,
  AfterViewInit,
  ViewChild,
  Renderer2,
  Injector,
  ComponentFactoryResolver,
  OnDestroy
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzDrawerService } from 'ng-zorro-antd';
import { INgxExcelDataSource, NgxExcelComponent } from 'ngx-excel';
import {
  BACKEND_PAGE,
  IBackendPageComponent,
  SchoolMenuService,
  Student,
} from '@uni/core';
import { combineLatest, Subscription, of } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { StudentPrimaryClassService } from '@uni/student';
import { StudentPrimaryClassEditComponent } from '../student-primary-class-edit/student-primary-class-edit.component';
import {StudentPrimaryClassComponent} from '../student-primary-class/student-primary-class.component';


@Component({
  selector: 'backend-page.students-primary-class',
  templateUrl: './students-primary-class-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: BACKEND_PAGE, useExisting: forwardRef(() => StudentsPrimaryClassPageComponent) },
    { provide: INgxExcelDataSource, useExisting: StudentPrimaryClassService },
  ]
})
export class StudentsPrimaryClassPageComponent extends IBackendPageComponent implements OnInit, AfterViewInit, OnDestroy {

  result: any;

  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();

  @ViewChild(NgxExcelComponent, { static: false }) private excelComponent: NgxExcelComponent;



  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected renderer2: Renderer2,
    protected injector: Injector,
    protected cfr: ComponentFactoryResolver,
    protected schoolMenuService: SchoolMenuService,
    protected drawer: NzDrawerService,
  ) {
    super(renderer2, injector, cfr);
  }

  ngAfterViewInit() {
    const reloadSubscription = combineLatest(this.activatedRoute.params, this.schoolMenuService.currentSchool$).pipe(
      map((resultSet) => {
        const params = resultSet[0] as { [name: string]: string };
        const currentStudent = resultSet[1] as Student;
        const filters: { schoolId: string, scope?: string } = { schoolId: currentStudent.id };
        if (params.scope) { filters.scope = params.scope; }
        return filters;
      })
    ).subscribe(
      (filters) => this.excelComponent.bindFilters(filters).reload()
    );
    this._componentSubscription.add(reloadSubscription);
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }


  /**
   * 添加学员投诉跟进记录
   */
  addSmall = () => {
    const drawerRef = this.drawer.create<StudentPrimaryClassEditComponent, {
    }>({
      nzWidth: '30%',
      nzBodyStyle: { height: '100%', overflow: 'auto', padding: '0 0 54px 0' },
      nzContent: StudentPrimaryClassEditComponent,
      nzContentParams: {}
    });
    return drawerRef.afterClose.pipe(
      filter((studentsPrimaryClass) => !!studentsPrimaryClass),
      map((studentsPrimaryClass) => [{ action: 'append', contexts: studentsPrimaryClass }])
    );
  }
  /**
   * 上下文菜单【查看详情】
   */
  view = ({ context }) => {
    if (!context || !context.id) { return; }
    this.drawer.create({
      nzWidth: '90%',
      nzBodyStyle: { padding: '0' },
      nzContent: StudentPrimaryClassComponent,
      nzContentParams: { studentId$: of(context.id), componentMode: 'portlet' }
    }).afterClose.subscribe((bool) => {
      if (bool) {
        this.router.navigate(['/vip_classes', context.id]);
      }
    });
  }

}
