import {Injectable} from '@angular/core';
import {
  ClassroomService,
  SchoolService,
  CurriculumPackageService, Classroom
} from '@uni/core';
import {map} from 'rxjs/operators';
import {NgxExcelDataService} from 'ngx-excel';
import {CurriculumScheduleService} from '../_services/curriculum-schedule.service';
import {CurriculumScheduleModel} from '../models/curriculum-schedule.model';

@Injectable()
export class CurriculumSchedulesEditMinorDataService extends NgxExcelDataService<CurriculumScheduleModel> {
  protected schoolResourceClassroomIds: string[];

  constructor(
    protected curriculumSchedulesService: CurriculumScheduleService,
    protected classroomService: ClassroomService,
    protected schoolService: SchoolService,
    protected curriculumPackageService: CurriculumPackageService
  ) {
    super();
  }

  /**
   * @inheritdoc
   */
  public getRules() {
    return this.curriculumSchedulesService.getRules();
  }

  public setResourceClassroom(ids: string[]) {
    this.schoolResourceClassroomIds = ids;
  }

  /**
   * 获取课件包列表
   * @param model 模型
   * @param keyword 关键字
   */
  public getPackageForeignModels(model: CurriculumScheduleModel, keyword?: string) {
    const param = {
      meta: 'total'
    };
    if (keyword) {
      // tslint:disable-next-line: no-string-literal
      param['keyword'] = keyword;
    }
    return this.curriculumPackageService.getList(param, 1, 20);
  }

  /**
   * 获取校区教室列表
   * @param model 模型
   * @param keyword 关键字
   */
  public getClassroomForeignModels(model: CurriculumScheduleModel, keyword?: string) {
    const param = {
      school_id: model.school.id,
      meta: 'total',
      status: '1' // 有效的教室
    };
    if (keyword) {
      // tslint:disable-next-line: no-string-literal
      param['keyword'] = keyword;
    }
    return this.classroomService.getList(param, 1, 20).pipe(
      map((res: Classroom[]) => {
        res.map((item) => {
          if (this.schoolResourceClassroomIds && (this.schoolResourceClassroomIds.includes(item.id.toString()))) {
            item.name = (model.classroom && item.id === model.classroom.id) ? item.name : '(已占用)' + item.name ;
          }
        });
        return res;
      })
    );
  }


}
