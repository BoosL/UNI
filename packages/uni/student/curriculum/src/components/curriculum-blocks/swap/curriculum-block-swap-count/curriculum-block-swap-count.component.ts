import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { TextMaskConfig } from 'angular2-text-mask';
import { INgxExcelDataSource } from 'ngx-excel';
import { SelectOption } from '@uni/core';
import { CurriculumBlockSwapCountNode } from '../curriculum-block-swap.model';
import { CurriculumBlockSwapComponent } from '../curriculum-block-swap-component';
import { CurriculumBlockSwapCountDataService } from './curriculum-block-swap-count-data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'curriculum-block-swap-count.curriculum-block',
  templateUrl: './curriculum-block-swap-count.component.html',
  providers: [
    { provide: INgxExcelDataSource, useClass: CurriculumBlockSwapCountDataService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurriculumBlockSwapCountComponent extends CurriculumBlockSwapComponent<CurriculumBlockSwapCountNode> implements OnInit {

  inputMaskConfig: TextMaskConfig;
  cantPlusButton: boolean;

  // tslint:disable-next-line: variable-name
  private _buyMode: SelectOption;

  ngOnInit() {
    super.ngOnInit();
    this._buyMode = this.cartService.getCurriculumCountMode();
    this.inputMaskConfig = { mask: [], placeholderChar: '\u2000' };
    this.inputMaskConfig.mask = (rawValue: string) => {
      if (!rawValue || rawValue.length === 0) { return [/\d/]; }
      rawValue = rawValue.replace(/\D+/g, '');
      return rawValue.split('').map((char) => /\d/.test(char) ? /\d/ : char);
    };
    this.cantPlusButton = false;
  }

  /**
   * 当减号按钮被点击时执行
   * @param e 事件
   * @param node 当前节点
   */
  handleMinusButtonClick(e: Event, node: CurriculumBlockSwapCountNode) {
    e.stopPropagation();
    e.preventDefault();
    const expectedCurriculumCount = node.expectedCurriculumCount - 1;
    this.handleExpectedCurriculumCountChange(`${expectedCurriculumCount < 0 ? 0 : expectedCurriculumCount}`, node);
  }

  /**
   * 当加号按钮被点击时执行
   * @param e 事件
   * @param node 当前节点
   */
  handlePlusButtonClick(e: Event, node: CurriculumBlockSwapCountNode) {
    e.stopPropagation();
    e.preventDefault();
    const expectedCurriculumCount = node.expectedCurriculumCount + 1;
    this.handleExpectedCurriculumCountChange(`${expectedCurriculumCount < 0 ? 0 : expectedCurriculumCount}`, node);
  }

  /**
   * 当期望课时数变更时执行
   * @param expectedCurriculumCount 期望的课时数
   * @param node 当前节点
   */
  handleExpectedCurriculumCountChange(expectedCurriculumCount: string, node: CurriculumBlockSwapCountNode) {
    if (!(/^\d+$/.test(expectedCurriculumCount))) { return; }
    node.expectedCurriculumCount = parseInt(expectedCurriculumCount, 10);
    this.complementaryChange.emit(this.computeComplementary());
    this.cdr.detectChanges();
  }

  /**
   * @inheritdoc
   */
  public getRequestParams() {
    return this.getDataService().nodes2requestParams(this.curriculumSwapNodes).map((requestParam) => {
      requestParam.buyMode = this._buyMode;
      return requestParam;
    });
  }

  /**
   * @inheritdoc
   */
  protected initial(): Observable<CurriculumBlockSwapCountNode[]> {
    return this.getDataService().getCurriculumSwapNodes({
      schoolId: this.cartService.getCurrentSchool().id,
      studentId: this.cartService.getCurrentStudent().id,
      productId: this.currentProduct.id
    });
  }

  /**
   * @inheritdoc
   */
  protected computeComplementary() {
    let remainedCurriculumCount = 0;
    let expectedCurriculumCount = 0;
    this.curriculumSwapNodes.forEach((curriculumSwapNode) => {
      remainedCurriculumCount += curriculumSwapNode.remainedCurriculumCount;
      expectedCurriculumCount += curriculumSwapNode.expectedCurriculumCount;
    });
    const complementary = remainedCurriculumCount - expectedCurriculumCount;
    this.cantPlusButton = complementary <= 0;
    return complementary;
  }

}
