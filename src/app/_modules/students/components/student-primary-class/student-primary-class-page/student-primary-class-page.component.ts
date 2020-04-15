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
import { Subject, Observable } from 'rxjs';
import { mergeMap, tap, map, filter, distinctUntilChanged } from 'rxjs/operators';
import { INgxExcelDataSource } from 'ngx-excel';
import { StudentPrimaryClassService, StudentsPrimaryClass } from '@uni/student';


@Component({
  selector: 'backend-page.student-primary-class',
  templateUrl: './student-primary-class-page.component.html',
  providers: [
    { provide: BACKEND_PAGE, useExisting: forwardRef(() => StudentPrimaryClassPageComponent) },
    { provide: INgxExcelDataSource, useExisting: StudentPrimaryClassService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentPrimaryClassPageComponent extends IBackendPageComponent implements OnInit {

  studentId$ = new Observable<string>();


  // tslint:disable: variable-name

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected renderer2: Renderer2,
    protected injector: Injector,
    protected cfr: ComponentFactoryResolver,
    protected message: NzMessageService,
  ) {
    super(renderer2, injector, cfr);
  }

  ngOnInit() {
    this.studentId$ = this.activatedRoute.params.pipe(
      map((params) => params.studentId),
      distinctUntilChanged()
    );
  }
  handleBackButtonClick(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }






}
