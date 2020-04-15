import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { NzMessageService, NzDrawerService } from 'ng-zorro-antd';
import { INgxExcelDataSource, NgxExcelComponentService, NgxExcelComponent, NgxExcelContextChanged } from 'ngx-excel';
import { ClassroomService, School, Classroom } from '@uni/core';
import { SchoolClassroomsComponentService } from '../../services/school-classrooms-component.service';
import { Observable, Subscription, of } from 'rxjs';
import { SchoolClassroomComponent } from '../school-classroom/school-classroom.component';
import { mergeMap, map, tap } from 'rxjs/operators';

@Component({
  selector: 'school-classrooms',
  templateUrl: './school-classrooms.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: ClassroomService },
    { provide: NgxExcelComponentService, useClass: SchoolClassroomsComponentService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchoolClassroomsComponent implements OnInit, AfterViewInit, OnDestroy {

  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();
  private _schoolId = null;

  @Input() school$: Observable<School>;
  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

  append = () => { this.message.warning('暂不支持该功能'); };
  edit = ({ context }) => {
    // const newContext = Object.assign({}, context);
    const drawerRef = this.drawer.create<SchoolClassroomComponent, { classroom: Classroom }, Classroom>({
      nzWidth: '70%',
      nzBodyStyle: { height: '100%', overflow: 'auto', padding: '0 0 54px 0' },
      nzContent: SchoolClassroomComponent,
      nzContentParams: { classroom: context }
    });

    return drawerRef.afterClose.pipe(
      mergeMap((classroom) => {
        if (!classroom) { return of([]); }
        this.message.loading('数据保存中，请稍候...');
        return this.classroomService.save(Object.assign({}, classroom, { schoolId: this._schoolId }), classroom.id);
      }),
      map((classroom) => ([{ action: 'updated', context: classroom }])),
      tap(() => this.message.remove())
    );
  }

  constructor(
    protected message: NzMessageService,
    protected drawer: NzDrawerService,
    protected classroomService: ClassroomService,
    protected componentService: NgxExcelComponentService
  ) { }

  ngOnInit() { }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    const schoolSubscription = this.school$.subscribe(
      (school) => {
        if (!school) { return; }
        this._schoolId = school.id;
        this.excelComponent.bindFilters({ schoolId: this._schoolId }).reload();
      }
    );
    this._componentSubscription.add(schoolSubscription);
  }

  enable(classroom: Classroom) {
    // this.message.loading('数据保存中，请稍候...');
    this.excelComponent.loading();
    (this.componentService as SchoolClassroomsComponentService).handleStatusChanged(
      classroom,
      Object.assign({}, classroom, {
        status: { label: '', value: '1' },
        schoolId: this._schoolId
      })
    ).subscribe((changedContexts) => {
      this.excelComponent.normal();
      // this.message.remove();
      this.excelComponent.handleChangedContexts(changedContexts);
    }, (e) => {
      this.excelComponent.normal();
      // this.message.remove();
      this.message.error(e.message || '系统错误，请联系管理员');
    });
  }

  disable(classroom: Classroom) {
    // this.message.loading('数据保存中，请稍候...');
    this.excelComponent.loading();
    (this.componentService as SchoolClassroomsComponentService).handleStatusChanged(
      classroom,
      Object.assign({}, classroom, {
        status: { label: '', value: '0' },
        schoolId: this._schoolId
      })
    ).subscribe((changedContexts) => {
      this.excelComponent.normal();
      this.excelComponent.handleChangedContexts(changedContexts);
    }, (e) => {
      this.excelComponent.normal();
      this.message.error(e.message || '系统错误，请联系管理员');
    });
  }

}
