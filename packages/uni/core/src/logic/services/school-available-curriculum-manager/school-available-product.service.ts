import { Injectable } from '@angular/core';
import { SchoolAvailableProduct } from '../../models/school-available-curriculum-manager.model';
import { BaseProductService } from '../curriculum-manager/curriculum-manager';

@Injectable()
export class SchoolAvailableProductService extends BaseProductService<SchoolAvailableProduct> {

  protected resourceUri = 'campuses/{school_id}/available_products';
  protected resourceName = 'available_products';

}
