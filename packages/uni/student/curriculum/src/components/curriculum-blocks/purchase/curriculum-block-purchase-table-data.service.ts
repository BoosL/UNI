import { SchoolAvailableSubjectService, SchoolAvailableProductService } from '@uni/core';
import { CurriculumTableDataService } from '@uni/curriculum';
import { CartService } from '../../../services/cart.service';

export class CurriculumBlockPurchaseTableDataService extends CurriculumTableDataService {

  constructor(
    protected cartService: CartService,
    protected productService: SchoolAvailableProductService,
    protected subjectService: SchoolAvailableSubjectService
  ) {
    super(productService, subjectService);
  }

}
