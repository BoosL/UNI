import { NgxExcelDataService } from 'ngx-excel';
import {
  StudentBoughtSubject,
  StudentBoughtCurriculum,
  SchoolAvailableSubject,
  SchoolAvailableCurriculum,
  SchoolAvailableSubjectService,
  SchoolAvailableCurriculumService
} from '@uni/core';
import { CartRequestParam } from '../../../models/cart.model';
import { CurriculumManagerService } from '../../../services/curriculum-manager.service';
import { CurriculumBlockSwapCountNode, CurriculumBlockSwapNoNode } from './curriculum-block-swap.model';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

export abstract class CurriculumBlockSwapDataService<T> extends NgxExcelDataService<T> {

  constructor(
    protected availableSubjectService: SchoolAvailableSubjectService,
    protected availableCurriculumService: SchoolAvailableCurriculumService,
    protected curriculumManagerService: CurriculumManagerService,
  ) {
    super();
  }

  /**
   * 根据产品获得学员的课时调整节点
   * @param filters 查询参数
   */
  protected getCurriculumSwapNodesByProduct({ schoolId, studentId, productId }): Observable<CurriculumBlockSwapCountNode[]> {
    const boughtSubjectsStream = this.curriculumManagerService.getBoughtSubjects({ schoolId, studentId, productId });
    const availableSubjectsStream = this.availableSubjectService.getList({ schoolId, productId });
    return forkJoin([boughtSubjectsStream, availableSubjectsStream]).pipe(
      map((resultSet) => {
        const boughtSubjects = resultSet[0] as StudentBoughtSubject[];
        const availableSubjects = resultSet[1] as SchoolAvailableSubject[];
        return availableSubjects.map((availableSubject) => {
          const matchedBoughtSubject = boughtSubjects.find((boughtSubject) => boughtSubject.id === availableSubject.id);
          const node = {
            relativeSubject: availableSubject,
            relativeProduct: availableSubject.relativeProduct
          } as CurriculumBlockSwapCountNode;
          node.remainedCurriculumCount = matchedBoughtSubject ?
            matchedBoughtSubject.remainedCurriculumCount : 0;
          node.expectedCurriculumCount = node.remainedCurriculumCount;
          node.id = JSON.stringify({ productId: node.relativeProduct.id, subjectId: node.relativeSubject.id });
          return node;
        });
      })
    );
  }

  /**
   * 根据科目获得学员的课号调整节点
   * @param filters 查询参数
   */
  protected getCurriculumSwapNodesBySubject({ schoolId, studentId, productId, subjectId }): Observable<CurriculumBlockSwapNoNode[]> {
    const boughtCurriculumsStream = this.curriculumManagerService.getBoughtCurriculums({ schoolId, studentId, productId, subjectId });
    const availableCurriculumsStream = this.availableCurriculumService.getList({ schoolId, productId, subjectId });
    return forkJoin([boughtCurriculumsStream, availableCurriculumsStream]).pipe(
      map((resultSet) => {
        const boughtCurriculums = resultSet[0] as StudentBoughtCurriculum[];
        const availableCurriculums = resultSet[1] as SchoolAvailableCurriculum[];
        return availableCurriculums.map((availableCurriculum) => {
          const matchedBoughtCurriculum = boughtCurriculums.find((boughtCurriculum) => boughtCurriculum.id === availableCurriculum.id);
          const node = {
            relativeCurriculum: availableCurriculum,
            relativeSubject: availableCurriculum.relativeSubject,
            relativeProduct: availableCurriculum.relativeProduct
          } as CurriculumBlockSwapNoNode;
          node.isBoughtCurriculum = !!matchedBoughtCurriculum;
          node.isExpectedCurriculum = node.isBoughtCurriculum;
          node.id = JSON.stringify({
            productId: node.relativeProduct.id,
            subjectId: node.relativeSubject.id,
            curriculumId: node.relativeCurriculum.id
          });
          return node;
        });
      })
    );
  }

  /**
   * 获得学员的课时/课号调整节点
   * @param filters 查询参数
   */
  public abstract getCurriculumSwapNodes(filters: { schoolId: string, studentId: string, productId: string }): Observable<T[]>;

  /**
   * 根据调整节点列表获得请求参数
   * @param nodes 调整节点列表
   */
  public abstract nodes2requestParams(nodes: T[]): CartRequestParam[];

}
