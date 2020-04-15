import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Input,
  AfterViewInit,
  ViewChild,
  Output,
  EventEmitter,
  Type,
  ComponentRef,
  ViewContainerRef,
  ComponentFactoryResolver,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import {INgxExcelDataSource, NgxExcelModelColumnRules} from 'ngx-excel';
import {CurriculumScheduleModel, RelativeEntity} from '../../models/curriculum-schedule.model';
import {CurriculumSchedulesEditEntriesDataService} from '../../services/curriculum-schedules-edit-entries-data.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {ProductService} from '@uni/core';
import {NzMessageService} from 'ng-zorro-antd';
import * as moment from 'moment';
import {
  CurriculumSchedulesEntriesStudentComponent
} from '../curriculum-schedules-entries/curriculum-schedules-entries-student/curriculum-schedules-entries-student.component';
import {
  CurriculumSchedulesEntriesCustomerComponent
} from '../curriculum-schedules-entries/curriculum-schedules-entries-customer/curriculum-schedules-entries-customer.component';
import {
  CurriculumSchedulesEntriesClassComponent
} from '../curriculum-schedules-entries/curriculum-schedules-entries-class/curriculum-schedules-entries-class.component';

interface ModelBlock {
  name: string;
  label: string;
  showBtn: boolean;
  component: Type<{}>;
  componentRef: ComponentRef<any>;
}

@Component({
  selector: 'curriculum-schedules-edit-entries',
  templateUrl: './curriculum-schedules-edit-entries.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CurriculumSchedulesEditEntriesDataService,
    { provide: INgxExcelDataSource, useExisting: CurriculumSchedulesEditEntriesDataService }
  ],
})
export class CurriculumSchedulesEditEntriesComponent implements OnInit, AfterViewInit {
  public rules: NgxExcelModelColumnRules<RelativeEntity>;
  public entriesStudentSubject = new BehaviorSubject<RelativeEntity[]>([]);
  public entriesCustomerSubject = new BehaviorSubject<RelativeEntity[]>([]);
  public entriesSmallClassSubject = new BehaviorSubject<RelativeEntity[]>([]);
  public modelBlocks = [
    {
      name: 'student',
      label: '新增学员',
      showBtn: false,
      component: CurriculumSchedulesEntriesStudentComponent,
      componentRef: null
    },
    {
      name: 'customer',
      label: '新增客户',
      showBtn: false,
      component: CurriculumSchedulesEntriesCustomerComponent,
      componentRef: null
    },
    {
      name: 'smallClass',
      label: '新增小班',
      showBtn: false,
      component: CurriculumSchedulesEntriesClassComponent,
      componentRef: null
    }
  ];
  // tslint:disable: variable-name
  private _componentValue: CurriculumScheduleModel;
  private _oldRelativeEntry: number;
  private _oldProductTypeValue: string;
  @Input() operateType: string;
  @Input() editType;
  @Input() componentValueSubject: Observable<CurriculumScheduleModel>;
  @Output() handleChange = new EventEmitter<CurriculumScheduleModel>();
  @ViewChild('modelContainer', {
    read: ViewContainerRef,
    static: false
  }) protected modelContainer: ViewContainerRef;

  constructor(
    protected excel: CurriculumSchedulesEditEntriesDataService,
    protected message: NzMessageService,
    protected productService: ProductService,
    protected cfr: ComponentFactoryResolver,
    protected changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.rules = this.excel.getRules();
    (this.excel as CurriculumSchedulesEditEntriesDataService).getAvailableRelativeEntriesSubject().subscribe((res) => {
      /*if (this._componentValue.relativeEntries) {
        this._componentValue.relativeEntries.forEach((item) => {
          if (item.id === res.id) {
            this._componentValue.relativeEntries.splice(this._componentValue.relativeEntries.indexOf(item), 1, res);*/
            this.handleChange.emit(this._componentValue);
     /*     }
        });
      }*/
    });
  }

  ngAfterViewInit() {
    this.componentValueSubject.subscribe((res) => {
      if (res) {
        if (res && res.productType && (!this._oldProductTypeValue || (this._oldProductTypeValue !== res.productType.value))) {
          this._oldProductTypeValue = res.productType.value;
          this._initModelBlocksBtn(res);
        }
        this._componentValue = res;
        this.excel.setComponentValue(this._componentValue);
        this._componentValue.relativeEntries = this._componentValue.relativeEntries ? this._componentValue.relativeEntries : [];
        if (this._componentValue.relativeEntries.length !== this._oldRelativeEntry) {
          this._assortRelativeEntries();
        }
        this._oldRelativeEntry = this._componentValue.relativeEntries.length;
        if (this.editType === 'entry' || this.editType === 'detail') {
          this._initModelBlock();
        }
      }
    });
  }

  private _initModelBlock() {
    if (this._componentValue && this._componentValue.productType) {
      this.handleAddBlock(this.modelBlocks[0]);
      if (this.excel.isDemoType(this._componentValue.productType)) {
        this.handleAddBlock(this.modelBlocks[1]);
      }
    }
  }

  /**
   * 初始化实体模块按钮
   */
  private _initModelBlocksBtn(schedule: CurriculumScheduleModel) {
    for (const item of this.modelBlocks) {
      item.showBtn = false;
      if (item.componentRef) {
        item.componentRef.destroy();
        item.componentRef = null;
      }
      if (this.excel.isVipClassType(schedule.productType) && item.name === 'smallClass') {
        item.showBtn = true;
      }
      if (this.excel.isDemoType(schedule.productType) && item.name === 'customer') {
        item.showBtn = true;
      }
      if (!this.excel.isVipClassType(schedule.productType) && item.name === 'student') {
        item.showBtn = true;
      }
    }
    this.changeDetectorRef.markForCheck();

  }

  /**
   * 新增排课实体
   */
  public appendRelativeEntity(_type: string) {
    if (this._componentValue) {
      if (this.operateType !== 'multiple' && this._componentValue.relativeEntries && this._componentValue.relativeEntries.length >= 1) {
        return;
      }
      if (!this._componentValue.curriculum || !this._componentValue.curriculum.id) {
        this.message.warning('请先选择课程列表');
        return;
      }
    }
    const item = this.excel.createModel({
      id: moment().toString(),
      type: _type === 'smallClass' ? this.excel.getEntryType(2) :
        (_type === 'customer' ? this.excel.getEntryType(11) : this.excel.getEntryType(10)),
      relativeSchool: this._componentValue.school
    });
    // tslint:disable: no-string-literal
    item['scheduleId'] = this._componentValue && this._componentValue.id ? this._componentValue.id.toString() : '';
    item['productType'] = this._componentValue.productType;
    item['curriculumId'] = this._componentValue.curriculum.id;
    this._componentValue.relativeEntries.unshift(item);
    this.handleChange.emit(this._componentValue);
  }

  /**
   * 删除排课实体
   */
  public removeRow(model: any) {
    if (this._componentValue.relativeEntries) {
      for (const item of this._componentValue.relativeEntries) {
        if (item.id === model.context.id ||
          (item.student && model.context.student && item.student.id === model.context.student.id) ||
          (item.customer && model.context.customer && item.customer.id === model.context.customer.id)) {
          this._componentValue.relativeEntries.splice(this._componentValue.relativeEntries.indexOf(item), 1);
          this.handleChange.emit(this._componentValue);
          break;
        }
      }
    }
  }

  /**
   * 实体分类
   */
  private _assortRelativeEntries() {
    this.entriesStudentSubject.next(
      this._componentValue.relativeEntries.filter((item) => (item.type && item.type.value === 'TEACHE_SCHEDULE_STUDENT')));
    this.entriesCustomerSubject.next(
      this._componentValue.relativeEntries.filter((item) => (item.type && item.type.value === 'TEACHE_SCHEDULE_CUSTOMER')));
    this.entriesSmallClassSubject.next(
      this._componentValue.relativeEntries.filter((item) => (item.type && item.type.value === 'SMALL_CLASS')));
  }

  /**
   * 添加模块
   */
  public handleAddBlock(modelBlock: ModelBlock) {
    if (modelBlock.componentRef) {
      this.modelContainer.insert(modelBlock.componentRef.hostView);
      return modelBlock.componentRef;
    }
    const componentFactory = this.cfr.resolveComponentFactory(modelBlock.component);
    modelBlock.componentRef = this.modelContainer.createComponent(componentFactory);
    // tslint:disable: no-string-literal
    modelBlock.componentRef.instance['rules'] = this.rules;
    modelBlock.componentRef.instance['editType'] = this.editType;
    if (modelBlock.name === 'student') {
      modelBlock.componentRef.instance['entriesSubject'] = this.entriesStudentSubject;
    }
    if (modelBlock.name === 'customer') {
      modelBlock.componentRef.instance['entriesSubject'] = this.entriesCustomerSubject;
    }
    if (modelBlock.name === 'smallClass') {
      modelBlock.componentRef.instance['entriesSubject'] = this.entriesSmallClassSubject;
    }
    modelBlock.componentRef.instance['handleAppendRelativeEntity'].subscribe((e: string) => this.appendRelativeEntity(e));
    modelBlock.componentRef.instance['handleRemoveRow'].subscribe((e: RelativeEntity) => this.removeRow(e));
    if (modelBlock.componentRef.instance['handleModelBlockRemoved']) {
      modelBlock.componentRef.instance['handleModelBlockRemoved'].subscribe((e: string) => this.handleModelBlockRemoved(e));
    }
    modelBlock.showBtn = false;
    this.changeDetectorRef.detectChanges();

  }

  /**
   * 删除模块
   * @param curriculumBlock 待删除的课程模块
   */
  protected handleModelBlockRemoved(name: string) {
    const modelBlock = this.modelBlocks.find((block) => block.name === name);
    if (modelBlock.componentRef) {
      modelBlock.componentRef.destroy();
      modelBlock.componentRef = null;
      modelBlock.showBtn = true;
      this.removeBatchEntries(name);
    }
  }

  /**
   * 删除模块导致批量删除实体
   * @param curriculumBlock 待删除的课程模块
   */
  private removeBatchEntries(name: string) {
    if (this._componentValue.relativeEntries) {
      this._componentValue.relativeEntries = this._componentValue.relativeEntries.filter((item) => {
        switch (name) {
          case 'student':
            return !(item.type && item.type.value === 'TEACHE_SCHEDULE_STUDENT');
          case 'customer':
            return !(item.type && item.type.value === 'TEACHE_SCHEDULE_CUSTOMER');
          case 'smallClass':
            return !(item.type && item.type.value === 'SMALL_CLASS');
        }
        return 0;
      });
      this.handleChange.emit(this._componentValue);
    }
  }
}
