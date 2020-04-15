import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendService } from '../../../services/backend.service';
import { SchoolAvailableSubject } from '../../models/school-available-curriculum-manager.model';
import { BaseProductSubjectService } from '../curriculum-manager/curriculum-manager';
import { SchoolAvailableProductService } from './school-available-product.service';

@Injectable()
export class SchoolAvailableSubjectService extends BaseProductSubjectService<SchoolAvailableSubject> {

  protected resourceUri = 'campuses/{school_id}/available_products/{product_id}/subjects';
  protected resourceName = 'available_subjects';

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected productService: SchoolAvailableProductService
  ) {
    super(httpClient, backendService, productService);
  }

}
