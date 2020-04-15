import {
  Input,
  ViewChild, Output, EventEmitter, Renderer2, ElementRef, OnDestroy
} from '@angular/core';
import {NgxExcelComponent, NgxExcelModelColumnRules, NgxExcelContextComponent} from 'ngx-excel';
import {Observable, Subscription} from 'rxjs';
import {RelativeEntity} from '../../models/curriculum-schedule.model';
export abstract class CurriculumSchedulesEntriesBaseComponent implements OnDestroy {
  public portletState = 'expand';
  // tslint:disable  variable-name
  protected _oldRelativeEntry = 0;
  protected _componentSubscription = new Subscription();
  @Input() rules: NgxExcelModelColumnRules<RelativeEntity>;
  @Input() entriesSubject: Observable<RelativeEntity[]>;
  @Input() editType: boolean;
  @Input() attachSelectTo: NgxExcelContextComponent;
  @Output() handleAppendRelativeEntity = new EventEmitter<string>();
  @Output() handleRemoveRow = new EventEmitter<RelativeEntity>();
  @Output() handleModelBlockRemoved = new EventEmitter<string>();
  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

  constructor(
    protected renderer2: Renderer2,
    protected el: ElementRef,
  ) {
  }

  ngOnDestroy(): void {
    this._componentSubscription.unsubscribe();
  }
  /**
   * 删除排课实体
   */
  public removeRow = (model: any) => {
    this.handleRemoveRow.emit(model);
  }

  public toggleExpand() {
    if (this.portletState === 'expand') {
      this.portletState = 'collapse';
      this.renderer2.addClass(this.el.nativeElement, 'collapse');
    } else {
      this.portletState = 'expand';
      this.renderer2.removeClass(this.el.nativeElement, 'collapse');
    }
  }

  public removeBlock(type: string) {
    this.handleModelBlockRemoved.emit(type);
  }
}
