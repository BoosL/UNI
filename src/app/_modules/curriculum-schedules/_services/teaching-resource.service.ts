import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BackendService, BaseService, ClassroomService, TeacherService} from '@uni/core';
import {ResourceClassroom, ResourceSchedule, ResourceTeacher, TeachingResourceModel} from '../models/teaching-resource.model';
import {NgxExcelColumnType} from 'ngx-excel';
import {CurriculumScheduleService} from './curriculum-schedule.service';


@Injectable({providedIn: 'root'})
export class TeachingResourceService extends BaseService<TeachingResourceModel> {
  protected resourceUri = 'campuses/{school_id}/teaching_resources';
  protected resourceName = 'campus_resources';
  protected rules = {
    id: {label: '#', columnType: NgxExcelColumnType.PrimaryKey},
    datetime: {label: '时间', columnType: NgxExcelColumnType.DateTime},
    allClassrooms: {label: '所有教室是否不可用', columnType: NgxExcelColumnType.Bool, prop: 'all_classrooms'},
    allTeachers: {label: '所有老师是否不可用', columnType: NgxExcelColumnType.Bool, prop: 'all_teachers'},
    classrooms: {
      label: '不可用教室',
      columnType: NgxExcelColumnType.MultiForeignKey,
      resolveValue: (o: any) => this.resolveClassroom(o)
    },
    teachers: {
      label: '不可用老师',
      columnType: NgxExcelColumnType.MultiForeignKey,
      resolveValue: (o: any) => this.resolveTeachers(o)
    },
    curriculumSchedules: {
      label: '已完成排课',
      columnType: NgxExcelColumnType.MultiForeignKey,
      resolveValue: (o: any) => this.resolveCurriculumSchedules(o)
    },
    restName: {label: '校区不可用原因', columnType: NgxExcelColumnType.Text, prop: 'rest_name'},
  };

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected teacherService: TeacherService,
    protected classroomService: ClassroomService,
    protected scheduleService: CurriculumScheduleService
  ) {
    super(httpClient, backendService);
  }
  protected resolveCurriculumSchedules(o: any): ResourceSchedule[] {
    if (o && o.curriculum_schedules && o.curriculum_schedules.length > 0) {
      const schedulesList = [];
      for (const item of o.curriculum_schedules) {
        schedulesList.push({
          id: item.id,
          serial: item.serial,
          curriculumSchedule: this.scheduleService.createModel(null, item.curriculum_schedule)
        } as ResourceSchedule);
      }
      return schedulesList;
    }
    return null;
  }

  protected resolveClassroom(o: any): ResourceClassroom[] {
    if (o && o.classrooms && o.classrooms.length > 0) {
      const classRoomsList = [];
      for (const item of o.classrooms) {
        classRoomsList.push({
          id: item.id,
          serial: item.serial,
          classroom: this.classroomService.createModel(item.classroom)
        } as ResourceClassroom);
      }
      return classRoomsList;
    }
    return null;
  }

  protected resolveTeachers(o: any): ResourceTeacher[] {
    if (o && o.teachers && o.teachers.length > 0) {
      const teachersList = [];
      for (const item of o.teachers) {
        teachersList.push({
          id: item.id,
          serial: item.serial,
          teacher: this.teacherService.createModel(null, item.teacher)
        } as ResourceTeacher);
      }
      return teachersList;
    }
    return null;
  }

}
