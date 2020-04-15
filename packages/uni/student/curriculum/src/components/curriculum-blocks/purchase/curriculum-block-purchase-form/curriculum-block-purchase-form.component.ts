import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { INgxExcelDataSource, NgxExcelModelColumnRules } from 'ngx-excel';
import { SelectOption } from '@uni/core';
import { CartEntity } from '../../../../models/cart.model';
import { CartService } from '../../../../services/cart.service';
import { CurriculumBlockPurchaseForm } from '../curriculum-block-purchase.model';
import { CurriculumBlockPurchaseFormService } from './curriculum-block-purchase-form.service';
import { of } from 'rxjs';
import { tap, delay, mergeMap, map } from 'rxjs/operators';

@Component({
  selector: 'curriculum-block-purchase-form',
  templateUrl: './curriculum-block-purchase-form.component.html',
  providers: [
    { provide: INgxExcelDataSource, useClass: CurriculumBlockPurchaseFormService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurriculumBlockPurchaseFormComponent implements OnInit {

  rules: NgxExcelModelColumnRules<CurriculumBlockPurchaseForm>;
  loading: boolean;
  cantEditLevelStart: boolean;
  cantEditLevelCount: boolean;
  curriculumFormValue: CurriculumBlockPurchaseForm;

  @Input() productType: SelectOption;
  @Output() curriculumFormSubmit = new EventEmitter<CartEntity[]>();

  constructor(
    protected cdr: ChangeDetectorRef,
    protected message: NzMessageService,
    protected cartService: CartService,
    protected dataService: INgxExcelDataSource<CurriculumBlockPurchaseForm>,
  ) { }

  ngOnInit() {
    this.rules = this._getDataService().getRules();
    const levels = this._getDataService().getEtpLevels();
    const currentStudent = this.cartService.getCurrentStudent();
    this.curriculumFormValue = { } as CurriculumBlockPurchaseForm;
    this.curriculumFormValue.id = (new Date()).getTime().toString();
    this.curriculumFormValue.curriculumCount = this._getDataService().getEtpFullCurriculumCount();
    this.curriculumFormValue.levelStart = levels.length > 0 ? levels[0] : null;
    this.curriculumFormValue.levelEnd = levels.length > 0 ? levels[0] : null;
    this.curriculumFormValue.levelCount = 1;
    this.curriculumFormValue.purpose = this._getDataService().getDefaultEtpPurpose();

    // tslint:disable-next-line: no-string-literal
    this.cantEditLevelStart = !!currentStudent['levelEtpStart'];
    this.cantEditLevelCount = false;
  }

  /**
   * 当表单值发生变化时执行
   * @param context 变化后的上下文模型
   */
  handleContextChange(context: CurriculumBlockPurchaseForm) {
    const fullCurriculumCount = this._getDataService().getEtpFullCurriculumCount();
    if (context.curriculumCount.value !== fullCurriculumCount.value) {
      this.cantEditLevelCount = true;
      context.levelCount = 1;
    } else {
      this.cantEditLevelCount = false;
    }

    const levels = this._getDataService().getEtpLevels();
    const levelStartIndex = context.levelStart ? levels.findIndex((level) => level.value === context.levelStart.value) : 0;
    const levelCountMax = levels.length - levelStartIndex;

    if (!context.levelCount || context.levelCount <= 0) {
      context.levelCount = 1;
    } else {
      context.levelCount = Math.min(context.levelCount, levelCountMax);
    }
    if (context.levelStart && levelCountMax) {
      context.levelEnd = levels[levelStartIndex + context.levelCount - 1];
    } else {
      context.levelEnd = null;
    }

    this.curriculumFormValue = Object.assign({}, context);
  }

  /**
   * 当表单提交时执行
   * @param e 事件
   */
  handleFormSubmit(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    of(null).pipe(
      tap(() => this.loading = true),
      delay(200),
      map(() => {
        const requestParam = this._getDataService().model2RequestParam(this.curriculumFormValue);
        requestParam.productType = this.productType;
        return requestParam;
      }),
      mergeMap((requestParam) => this.cartService.addToCart(requestParam))
    ).subscribe((entities) => {
      this.loading = false;
      this.cdr.detectChanges();
      this.curriculumFormSubmit.emit(entities);
    }/* , (error) => {
      this.loading = false;
      this.message.error(error.message || '系统错误，请联系管理员');
      this.cdr.detectChanges();
    } */);
  }

  /**
   * 获得数据供应服务
   */
  private _getDataService(): CurriculumBlockPurchaseFormService {
    return this.dataService as CurriculumBlockPurchaseFormService;
  }

}
