import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseProductCurriculumService } from '../curriculum-manager/curriculum-manager';
import { BackendService } from '../../../services/backend.service';
import { SchoolAvailableCurriculum } from '../../models/school-available-curriculum-manager.model';
import { SchoolAvailableProductService } from './school-available-product.service';
import { SchoolAvailableSubjectService } from './school-available-subject.service';

@Injectable()
export class SchoolAvailableCurriculumService extends BaseProductCurriculumService<SchoolAvailableCurriculum> {

  protected resourceUri = 'campuses/{school_id}/available_products/{product_id}/subjects/{subject_id}/curriculums';
  protected resourceName = 'available_curriculums';

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected productService: SchoolAvailableProductService,
    protected subjectService: SchoolAvailableSubjectService
  ) {
    super(httpClient, backendService, productService, subjectService);
  }

}
