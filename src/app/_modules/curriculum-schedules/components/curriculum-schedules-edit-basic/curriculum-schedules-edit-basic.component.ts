import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild
} from '@angular/core';
import {
  INgxExcelDataSource,
  NgxExcelComponentService,
  NgxExcelModelColumnRules,
  NgxExcelContextComponent
} from 'ngx-excel';
import {CurriculumScheduleModel} from '../../models/curriculum-schedule.model';
import {CurriculumSchedulesEditBasicDataService} from '../../services/curriculum-schedules-edit-basic-data.service';
import {
  CurriculumSchedulesEditBasicComponentService
} from '../../services/curriculum-schedules-edit-basic-component.service';
import {Observable} from 'rxjs';
import {ProductService} from '@uni/core';

@Component({
  selector: 'curriculum-schedules-edit-basic',
  templateUrl: './curriculum-schedules-edit-basic.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CurriculumSchedulesEditBasicDataService,
    { provide: INgxExcelDataSource, useExisting: CurriculumSchedulesEditBasicDataService },
    { provide: NgxExcelComponentService, useClass: CurriculumSchedulesEditBasicComponentService }
  ],
})
export class CurriculumSchedulesEditBasicComponent implements OnInit, AfterViewInit {
  public rules: NgxExcelModelColumnRules<CurriculumScheduleModel>;
  public componentValue: CurriculumScheduleModel;

  // tslint:disable: variable-name
  @Input() schoolResourceTeacherIds;
  @Input() componentValueSubject: Observable<CurriculumScheduleModel>;
  @Input() operateType: string;
  @Input() attachSelectTo: NgxExcelContextComponent;
  @Output() handleChange = new EventEmitter<CurriculumScheduleModel>();
  @ViewChild(NgxExcelContextComponent, {static: false}) contextComponent: NgxExcelContextComponent;

  constructor(
    protected excel: CurriculumSchedulesEditBasicDataService,
    protected productService: ProductService,
    protected changeDetectorRef: ChangeDetectorRef,
  ) {

  }

  ngOnInit() {
    this.rules = this.excel.getRules();
    this.rules.productType.selectOptions = this.operateType === 'multiple' ?
      this.productService.getMultiStudentProductTypes() : this.productService.getSingleStudentProductTypes();
    this.excel.setResourceTeacherIds(this.schoolResourceTeacherIds);
  }
  ngAfterViewInit(): void {
    this.componentValueSubject.subscribe(
      (schedule) => {
        this.componentValue = Object.assign({}, schedule);
        this.changeDetectorRef.detectChanges();
      }
    );
  }

  /**
   * 监听数据变更
   * @param event 本地变更后排课数据
   */
  public handleBasicChange(event: CurriculumScheduleModel) {
    this.handleChange.emit(event);
  }
}
