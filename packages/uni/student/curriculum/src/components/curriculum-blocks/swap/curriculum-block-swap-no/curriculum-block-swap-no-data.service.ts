import { Injectable } from '@angular/core';
import { NgxExcelModelColumnRules, NgxExcelColumnType } from 'ngx-excel';
import { CartRequestParam } from '../../../../models/cart.model';
import { CurriculumBlockSwapNoNode } from '../curriculum-block-swap.model';
import { CurriculumBlockSwapDataService } from '../curriculum-block-swap-data-service';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable()
export class CurriculumBlockSwapNoDataService extends CurriculumBlockSwapDataService<CurriculumBlockSwapNoNode> {

  protected rules: NgxExcelModelColumnRules<CurriculumBlockSwapNoNode>;
  protected cachedRelativeSubjects = [];

  /**
   * @inheritdoc
   */
  public getRules(): NgxExcelModelColumnRules<CurriculumBlockSwapNoNode> {
    if (!this.rules) {
      const curriculumManagerRules = this.curriculumManagerService.getRules();
      const rules: any = {};
      rules.id = {
        label: '虚拟主键', columnType: NgxExcelColumnType.PrimaryKey
      };
      rules.isBoughtCurriculum = {
        label: '是否已购课程', columnType: NgxExcelColumnType.Bool
      };
      rules.isExpectedCurriculum = {
        label: '是否期望课程', columnType: NgxExcelColumnType.Bool
      };
      rules.relativeProduct = curriculumManagerRules.relativeProduct;
      rules.relativeSubject = curriculumManagerRules.relativeSubject;
      rules.relativeCurriculum = {
        label: '关联的课程', columnType: NgxExcelColumnType.ForeignKey,
        relativeService: null, labelKey: 'name'
      };
      Object.keys(rules).forEach((ruleKey) => rules[ruleKey].name = ruleKey);
      this.rules = rules;
    }
    return this.rules;
  }

  public getRelativeSubjectForeignModels(_: CurriculumBlockSwapNoNode) {
    return of(this.cachedRelativeSubjects);
  }

  /**
   * 获得学员的课号调整节点
   */
  public getCurriculumSwapNodes(
    filters: { schoolId: string, studentId: string, productId: string, subjectId?: string }
  ): Observable<CurriculumBlockSwapNoNode[]> {
    return this.getCurriculumSwapNodesByProduct(filters).pipe(
      map((curriculumSwapCountNodes) => {
        this.cachedRelativeSubjects = [
          ...curriculumSwapCountNodes.map(
            (curriculumSwapCountNode) => Object.assign({}, curriculumSwapCountNode.relativeSubject)
          )
        ];
        return Object.assign({}, filters, { subjectId: filters.subjectId || curriculumSwapCountNodes[0].relativeSubject.id });
      }),
      mergeMap((filtersWithSubjectId) => this.getCurriculumSwapNodesBySubject(filtersWithSubjectId))
    );
  }

  /**
   * @inheritdoc
   */
  public nodes2requestParams(nodes: CurriculumBlockSwapNoNode[]): CartRequestParam[] {
    const payload: { [payloadKey: string]: CartRequestParam } = {};
    nodes.forEach((node) => {
      if (node.isBoughtCurriculum === node.isExpectedCurriculum) { return; }
      if (node.isBoughtCurriculum) {
        // 已购 -> 退
        const payloadKey = `1-${node.relativeProduct.id}-${node.relativeSubject.id}`;
        if (!payload[payloadKey]) {
          payload[payloadKey] = {
            action: 'refund',
            productType: node.relativeProduct.type,
            product: node.relativeProduct,
            subject: node.relativeSubject,
            curriculums: []
          } as CartRequestParam;
        }
        payload[payloadKey].curriculums.push(node.relativeCurriculum);
      } else {
        // 未购 -> 换
        const payloadKey = `0-${node.relativeProduct.id}-${node.relativeSubject.id}`;
        if (!payload[payloadKey]) {
          payload[payloadKey] = {
            action: 'buy',
            productType: node.relativeProduct.type,
            product: node.relativeProduct,
            subject: node.relativeSubject,
            curriculums: []
          } as CartRequestParam;
        }
        payload[payloadKey].curriculums.push(node.relativeCurriculum);
      }
    });
    return Object.values(payload);
  }

}
