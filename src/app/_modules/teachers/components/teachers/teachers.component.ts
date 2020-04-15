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
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { INgxExcelDataSource, NgxExcelComponent, NgxExcelComponentService } from 'ngx-excel';
import { BACKEND_PAGE, IBackendPageComponent, TeacherService, SchoolMenuService, School, Employee, SelectOption } from '@uni/core';
import { combineLatest, of, Subscription } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { TeachersComponentService } from '../../services/teachers-component.service';

@Component({
  selector: 'backend-page.teachers',
  templateUrl: './teachers.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: BACKEND_PAGE, useExisting: forwardRef(() => TeachersComponent) },
    { provide: INgxExcelDataSource, useExisting: TeacherService },
    { provide: NgxExcelComponentService, useClass: TeachersComponentService }
  ]
})
export class TeachersComponent extends IBackendPageComponent implements OnInit, OnDestroy, AfterViewInit {

  private _componentSubscription = new Subscription();

  @ViewChild(NgxExcelComponent, { static: false }) private _excelComponent: NgxExcelComponent;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected renderer2: Renderer2,
    protected injector: Injector,
    protected cfr: ComponentFactoryResolver,
    protected message: NzMessageService,
    protected schoolMenuService: SchoolMenuService,
    protected teacherService: TeacherService,
    protected componentService: NgxExcelComponentService
  ) {
    super(renderer2, injector, cfr);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngAfterViewInit() {
    const reloadSubscription = combineLatest(this.activatedRoute.params, this.schoolMenuService.currentSchool$).pipe(
      map((resultSet) => {
        const params = resultSet[0] as { [name: string]: string };
        const currentSchool = resultSet[1] as School;
        const filters: { schoolId: string, scope?: string } = { schoolId: currentSchool.id };
        if (params.scope) { filters.scope = params.scope; }
        return filters;
      })
    ).subscribe(
      (filters) => this._excelComponent.bindFilters(filters).reload()
    );
    this._componentSubscription.add(reloadSubscription);
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  /**
   * 判断员工是否为 Etp 老师
   * @param employee 待判断的员工
   */
  isEtpTeacher(employee: Employee) {
    return this.teacherService.isEtp(employee);
  }

  /**
   * 反转老师的 Etp 标签
   * @param employee 员工
   */
  toggleEtpTags(employee: Employee) {
    const tags = employee.tags.some((tag) => tag.value === '1') ?
      [...employee.tags.filter((tag) => tag.value !== '1')] :
      [...employee.tags, { label: '', value: '1' }];

    of({ tags }).pipe(
      mergeMap(
        (payload) => this.schoolMenuService.currentSchool$
          .pipe(map((currentSchool) => Object.assign({}, payload, { schoolId: currentSchool.id })))
      ),
      tap(() => this._excelComponent.loading()),
      mergeMap(
        (payload) => (this.componentService as TeachersComponentService).handleTagsChanged(employee, Object.assign({}, employee, payload))
      ),
    ).subscribe((changedContexts) => {
      this._excelComponent.normal();
      this._excelComponent.handleChangedContexts(changedContexts);
    }, (e) => {
      this._excelComponent.normal();
      this.message.error(e.message || '系统错误，请联系管理员');
    });
  }

}
