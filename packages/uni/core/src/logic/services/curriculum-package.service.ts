import { Injectable } from '@angular/core';
import { BaseService } from '../../services/base.service';
import { CurriculumPackage } from '../models/curriculum-package.model';
import { NgxExcelModelColumnRules, NgxExcelColumnType } from 'ngx-excel';

@Injectable()
export class CurriculumPackageService extends BaseService<CurriculumPackage> {

  protected resourceUri = 'packages';
  protected resourceName = 'packages';
  protected rules = {
    id: { label: '课件包主键', columnType: NgxExcelColumnType.PrimaryKey },
    name: { label: '课件包名称', columnType: NgxExcelColumnType.Text }
  } as NgxExcelModelColumnRules<CurriculumPackage>;

}
