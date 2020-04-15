import {Injectable} from '@angular/core';
import {NgxExcelDataService} from 'ngx-excel';
import {CurriculumScheduleModel} from '../models/curriculum-schedule.model';
import {CurriculumScheduleService} from '../_services/curriculum-schedule.service';


@Injectable()
export class CurriculumSchedulesListDataService extends NgxExcelDataService<CurriculumScheduleModel> {
  // tslint:disable: variable-name
  constructor(
    protected curriculumSchedulesService: CurriculumScheduleService,
  ) {
    super();
  }
  /**
   * @inheritdoc
   */
  public getRules() {
    return this.curriculumSchedulesService.getRules();
  }
}
