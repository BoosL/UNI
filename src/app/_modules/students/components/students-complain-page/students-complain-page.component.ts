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
import { combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { StudentComplainService } from '@uni/student';


@Component({
  selector: 'backend-page.students-complain',
  templateUrl: './students-complain-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: BACKEND_PAGE, useExisting: forwardRef(() => StudentsComplainPageComponent) },
    { provide: INgxExcelDataSource, useExisting: StudentComplainService },
  ]
})
export class StudentsComplainPageComponent extends IBackendPageComponent implements OnInit, AfterViewInit, OnDestroy {

  result: any;

  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();

  @ViewChild(NgxExcelComponent, { static: false }) private excelComponent: NgxExcelComponent;

  /**
   * 上下文菜单【查看详情】
   */
  view = ({ context }) => { this.router.navigate(['./', context.id], { relativeTo: this.activatedRoute }); };

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
        const filters: { campusId: string, scope?: string } = { campusId: currentStudent.id };
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


}
