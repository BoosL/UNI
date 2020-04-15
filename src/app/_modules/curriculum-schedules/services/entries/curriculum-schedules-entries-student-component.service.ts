import {Injectable} from '@angular/core';
import {of} from 'rxjs';
import {NgxExcelComponentService} from 'ngx-excel';
import {CurriculumSchedulesEditEntriesDataService} from '../curriculum-schedules-edit-entries-data.service';
import {RelativeEntity} from '../../models/curriculum-schedule.model';
import {EntryStudentModel} from '../../models/entry-student.model';
import {EntryStudentService} from '../../_services/entry-student.service';

@Injectable()
export class CurriculumSchedulesEntriesStudentComponentService extends NgxExcelComponentService {

  constructor(
    private editEntriesDataService: CurriculumSchedulesEditEntriesDataService,
    private entryStudentService: EntryStudentService
  ) {
    super();
  }

  /**
   * 判断删除按钮是否可用
   */
  public canRemove(model: RelativeEntity, action: string) {
    // 审核中，已签课不能删除
    // tslint:disable-next-line: no-string-literal
    return this.editEntriesDataService.canAddRow() || !model['scheduleId'];
  }

  public privilegeRemove(model: RelativeEntity, action: string) {
    // 审核中，已签课不能删除
    // tslint:disable-next-line: no-string-literal
    return this.editEntriesDataService.canAddRow() || !model['scheduleId'];
  }

  /**
   * 判断新增按钮是否可用
   */
  public canAddRow(model: RelativeEntity, action: string) {
    return this.editEntriesDataService.canAddRow();
  }

  public privilegeAddRow(model: RelativeEntity, action: string) {
    return this.editEntriesDataService.canAddRow();
  }
  public canEditRelativeSchool(model: RelativeEntity) {
    // tslint:disable: no-string-literal
    return !this.editEntriesDataService.isSingleStudentType(model['productType']) &&
      !(model['scheduleStatus'] && ['3', '4'].includes(model['scheduleStatus'])) && this.editEntriesDataService.judgeDetailInfo();
  }
  public canEditStudent(model: RelativeEntity) {
    // tslint:disable: no-string-literal
    return model.relativeSchool && !(model['scheduleId'] && this.editEntriesDataService.isSingleStudentType(model['productType'])) &&
      !(model['scheduleStatus'] && ['3', '4'].includes(model['scheduleStatus'])) && this.editEntriesDataService.judgeDetailInfo();
  }
  public canEditSignClass(model: EntryStudentModel) {
    return !model.save;
  }

  /**
   * 当学员校区变更时执行
   * @param originalModel 原始模型
   * @param model 变更后模型
   */
  public handleRelativeSchoolChanged(originalModel: RelativeEntity, model: RelativeEntity) {
    model.student = null;
    this.editEntriesDataService.setRelativeEntity(model);
    return of([{ action: 'updated', context: model }]);
  }


  /**
   * 当学员变更时执行
   * @param originalModel 原始模型
   * @param model 变更后模型
   */
  public handleStudentChanged(originalModel: RelativeEntity, model: RelativeEntity) {
    this.editEntriesDataService.setRelativeEntity(model);
    if (this.editEntriesDataService.isSingleStudentType(model['productType'])) {
        this.editEntriesDataService.setScheduleTeacher(model);
    }
    return of([{ action: 'updated', context: model }]);
  }

  /**
   * 当签课状态变更时执行
   * @param originalModel 原始模型
   * @param model 变更后模型
   */
  public handleSignClassChanged(originalModel: EntryStudentModel, model: EntryStudentModel) {
    this.entryStudentService.setEntryStudent(model);
    return of([{ action: 'updated', context: model }]);
  }
}
