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
  OnDestroy,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { INgxExcelDataSource, NgxExcelComponent } from 'ngx-excel';
import {
  BACKEND_PAGE,
  IBackendPageComponent,
  SchoolMenuService,
  Student,
  School,
} from '@uni/core';
import { combineLatest, Subscription, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { StudentExtService, StudentComponent, StudentExt } from '@uni/student';
import { NzDrawerService, NzModalService } from 'ng-zorro-antd';
import { StudentsSearchComponent } from '../students-search/students-search.component';
import { StudentSearch } from '../../models/student-search.model';
import { StudentsSearchService } from '../../services/students-search.service';


@Component({
  selector: 'backend-page.students',
  templateUrl: './students-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: BACKEND_PAGE, useExisting: forwardRef(() => StudentsPageComponent) },
    { provide: INgxExcelDataSource, useExisting: StudentExtService }
  ]
})
export class StudentsPageComponent extends IBackendPageComponent implements OnInit, AfterViewInit, OnDestroy {


  private _searchConditions: StudentSearch;
  private _selectStudents: StudentSearch[];
  private _filters: any;


  result: string;

  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();

  @Output() handleChangeSelect = new EventEmitter<StudentSearch[]>();
  @Output() followSuccess = new EventEmitter();

  @ViewChild(NgxExcelComponent, { static: false }) private excelComponent: NgxExcelComponent;


  constructor(
    private el: ElementRef,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected renderer2: Renderer2,
    protected drawer: NzDrawerService,
    protected injector: Injector,
    protected cfr: ComponentFactoryResolver,
    protected modal: NzModalService,
    protected schoolMenuService: SchoolMenuService,
    protected studentExtService: StudentExtService,
    protected studentsSearchService: StudentsSearchService
  ) {
    super(renderer2, injector, cfr);
  }

  ngAfterViewInit() {
    const reloadSubscription = combineLatest(this.activatedRoute.params, this.schoolMenuService.currentSchool$).pipe(
      map((resultSet) => {
        const params = resultSet[0] as { [name: string]: string };
        const currentStudent = resultSet[1] as StudentExt;
        const filters: { schoolId: string, scope?: string } = { schoolId: currentStudent.id };
        if (params.scope) { filters.scope = params.scope; }
        return filters;
      }),
      tap((filters) => this._filters = filters)
    ).subscribe(
      (filters) => {
        this.excelComponent.bindFilters(filters).reload();
      }
    );

    this._componentSubscription.add(reloadSubscription);
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  /**
   * 上下文菜单【查看详情】
   */
  public view = ({ context }) => {
    if (!context || !context.id) {
      return;
    }
    this.drawer.create({
      nzWidth: '90%',
      nzBodyStyle: { padding: '0' },
      nzContent: StudentComponent,
      nzContentParams: { studentId$: of(context.id), componentMode: 'portlet' }
    }).afterClose.subscribe((student) => {
      if (student === null || student === undefined) {
        return;
      }
      if (typeof (student) === 'boolean' && student) {
        this._reloadStudents();
        this.followSuccess.emit();
        return;
      }
      this.router.navigate(['/students', context.id]);
    });
  }


  /**
   * 学员搜索
   */
  public handleSearchButtonClick(e: any) {
    e.stopPropagation();
    e.preventDefault();
    this.modal.create({
      nzWidth: '540',
      nzBodyStyle: { padding: '0' },
      nzContent: StudentsSearchComponent,
      nzComponentParams: { context: this._searchConditions }
    }).afterClose.subscribe((searchConditions) => {
      // 返回 undefined 代表直接关闭
      if (searchConditions === undefined) { return; }
      this._searchConditions = searchConditions || {};
      const _search = Object.assign(this._filters, this._searchConditions);
      console.log(_search, '_search');
      // this.studentExtService.batchSave(this._filters);
      this.excelComponent.bindFilters(
        this.studentsSearchService.getConditions(this._searchConditions)
      ).reload();
    });
  }

  private _reloadStudents() {
    if (!this.excelComponent) {
      return;
    }
    this._selectStudents = [];
    this.excelComponent.bindFilters(this._filters).reload();
    this.handleChangeSelect.emit(this._selectStudents);
  }
}
