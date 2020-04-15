import { SelectOption } from '@uni/core';
import { CartEntity } from '../../../models/cart.model';

export interface CurriculumBlockPurchaseForm {
  id: string;
  curriculumCount: SelectOption;
  levelStart: SelectOption;
  levelEnd: SelectOption;
  levelCount: number;
  purpose: SelectOption;
}

export interface CurriculumBlockPurchaseNode {
  productType: SelectOption;
}
