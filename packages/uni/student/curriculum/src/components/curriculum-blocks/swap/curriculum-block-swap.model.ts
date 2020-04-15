import { Product, ProductSubject, ProductCurriculum } from '@uni/core';

export interface CurriculumBlockSwapCountNode {
  id: string;
  remainedCurriculumCount: number;
  expectedCurriculumCount: number;
  relativeProduct: Product;
  relativeSubject: ProductSubject;
}

export interface CurriculumBlockSwapNoNode {
  id: string;
  isBoughtCurriculum: boolean;
  isExpectedCurriculum: boolean;
  relativeProduct: Product;
  relativeSubject: ProductSubject;
  relativeCurriculum: ProductCurriculum;
}
