import {
  Component,
  ComponentFactoryResolver,
  Renderer2,
  Injector,
  ChangeDetectionStrategy,
  forwardRef,
  OnInit,
  AfterViewInit,
  ViewChild, OnDestroy
} from '@angular/core';
import {
  IBackendPageComponent,
  BACKEND_PAGE, SchoolMenuService, School, SchoolService,
} from '@uni/core';
import { Router, ActivatedRoute } from '@angular/router';
import { INgxExcelDataSource, NgxExcelComponent, NgxExcelComponentService } from 'ngx-excel';
import { TeacherScheduleService, TeacherSchedule } from '@uni/core';
import { TeacherSchedulesComponentService } from '../../services/teacher-schedules-component.service';
import { NzDrawerService, NzMessageService } from 'ng-zorro-antd';
import { TeacherScheduleEditComponent } from '../teacher-schedule-edit/teacher-schedule-edit.component';
import {BehaviorSubject, Subscription} from 'rxjs';
import { map, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'backend-page.teachers-rest',
  templateUrl: './teacher-schedules.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: BACKEND_PAGE, useExisting: forwardRef(() => TeacherSchedulesComponent) },
    { provide: INgxExcelDataSource, useExisting: TeacherScheduleService },
    { provide: NgxExcelComponentService, useClass: TeacherSchedulesComponentService }
  ]
})
export class TeacherSchedulesComponent extends IBackendPageComponent implements OnInit, AfterViewInit, OnDestroy {

  school$ = new BehaviorSubject<School>(null);

  // tslint:disable: variable-name
  private _relativeSchool: School;
  private _componentSubscription = new Subscription();
  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

  append = () => {
    if (!this._relativeSchool) { return; }
    const drawerRef = this.drawer.create<TeacherScheduleEditComponent, {
      teacherSchedule: TeacherSchedule,
      relativeSchool: School
    }, TeacherSchedule>({
      nzWidth: '75%',
      nzBodyStyle: { height: '100%', overflow: 'auto', padding: '0 0 54px 0' },
      nzContent: TeacherScheduleEditComponent,
      nzContentParams: { teacherSchedule: null, relativeSchool: this._relativeSchool }
    });
    return drawerRef.afterClose.pipe(
      filter((teachersRestTime) => !!teachersRestTime),
      map((teachersRestTime) => [{ action: 'append', context: teachersRestTime }])
    );
  }

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected renderer2: Renderer2,
    protected injector: Injector,
    protected message: NzMessageService,
    protected cfr: ComponentFactoryResolver,
    protected schoolMenuService: SchoolMenuService,
    protected schoolService: SchoolService,
    protected drawer: NzDrawerService
  ) {
    super(renderer2, injector, cfr);
  }

  ngAfterViewInit() {
    this._componentSubscription.add(this.schoolMenuService.currentSchool$
      .pipe(distinctUntilChanged())
      .subscribe(
        (currentSchool) => {
          this._relativeSchool = currentSchool as School;
          this.excelComponent.bindFilters({ schoolId: this._relativeSchool.id }).reload();
        },
        (e) => this.message.error(e.message || '系统错误，请联系管理员')
      )
    );
  }
  ngOnDestroy(): void {
    this._componentSubscription.unsubscribe();
  }

}
