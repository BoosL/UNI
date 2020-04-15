import { Injectable } from '@angular/core';
import { NgxExcelModelColumnRules, NgxExcelColumnType } from 'ngx-excel';
import { CartRequestParam } from '../../../../models/cart.model';
import { CurriculumBlockSwapCountNode } from '../curriculum-block-swap.model';
import { CurriculumBlockSwapDataService } from '../curriculum-block-swap-data-service';
import { Observable } from 'rxjs';

@Injectable()
export class CurriculumBlockSwapCountDataService extends CurriculumBlockSwapDataService<CurriculumBlockSwapCountNode> {

  /**
   * @inheritdoc
   */
  public getRules(): NgxExcelModelColumnRules<CurriculumBlockSwapCountNode> {
    const curriculumManagerRules = this.curriculumManagerService.getRules();
    const rules: any = {};
    rules.id = {
      label: '虚拟主键', columnType: NgxExcelColumnType.PrimaryKey
    };
    rules.remainedCurriculumCount = curriculumManagerRules.remainedCurriculumCount;
    rules.expectedCurriculumCount = {
      label: '期望课时', columnType: NgxExcelColumnType.Number, optional: true
    };
    rules.relativeProduct = curriculumManagerRules.relativeProduct;
    rules.relativeSubject = curriculumManagerRules.relativeSubject;
    Object.keys(rules).forEach((ruleKey) => rules[ruleKey].name = ruleKey);
    return rules;
  }

  /**
   * @inheritdoc
   */
  public getCurriculumSwapNodes(
    filters: { schoolId: string, studentId: string, productId: string }
  ): Observable<CurriculumBlockSwapCountNode[]> {
    return this.getCurriculumSwapNodesByProduct(filters);
  }

  /**
   * @inheritdoc
   */
  public nodes2requestParams(nodes: CurriculumBlockSwapCountNode[]): CartRequestParam[] {
    const payload: CartRequestParam[] = [];
    nodes.forEach((node) => {
      const complementary = node.remainedCurriculumCount - node.expectedCurriculumCount;
      if (complementary > 0) {
        payload.push({
          action: 'refund',
          productType: node.relativeProduct.type,
          product: node.relativeProduct,
          subject: node.relativeSubject,
          curriculumCount: complementary
        } as CartRequestParam);
      } else if (complementary < 0) {
        payload.push({
          action: 'buy',
          productType: node.relativeProduct.type,
          product: node.relativeProduct,
          subject: node.relativeSubject,
          curriculumCount: - complementary
        } as CartRequestParam);
      }
    });
    return payload;
  }

}
