import { Injectable } from '@angular/core';
import { NgxExcelComponentService } from 'ngx-excel';
import {TmkCustomersSearch} from '../../models/tmk-customers-search.model';
import {of} from 'rxjs';

@Injectable()
export class TmkCustomersSearchComponentService extends NgxExcelComponentService {
  /*
   * 一级渠道变更*/
  handleRelativeFirstSourceChange(originalModel: TmkCustomersSearch, model: TmkCustomersSearch) {
    model.relativeSecondSource = null;
    model.relativeThirdSource = null;
    return of([{action: 'update', context: model}]);
  }
  /*
 * 二级渠道变更*/
  handleRelativeSecondSourceChange(originalModel: TmkCustomersSearch, model: TmkCustomersSearch) {
    model.relativeThirdSource = null;
    return of([{action: 'update', context: model}]);
  }
}
