import {HttpClient} from '@angular/common/http';
import {BaseService, BackendService, SchoolMenuService} from '@uni/core';
import {NgxExcelColumnType} from 'ngx-excel';
import {CurriculumSchedulesImportExport} from '../models/curriculum-schedules-import-export.model';
import {Injectable} from '@angular/core';
import {WebApiHttpResponse} from '@uni/common/public-api';
import {map} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CurriculumSchedulesImportExportService extends BaseService<CurriculumSchedulesImportExport> {
  protected resourceUri = '/campuses/{school_id}/curriculum_schedules/_import';
  protected resourceName = '';
  protected rules = {
    downloadUrl: { label: '课表下载地址', columnType: NgxExcelColumnType.Text, prop: 'download_url' },
    date: { label: '排课日期', columnType: NgxExcelColumnType.Date },
    attachment: {
      label: '上传课表', columnType: NgxExcelColumnType.UploadFile, acceptedFileCount: 1,
      acceptedFileSize: 800, acceptedFileType: ['.xlsx'],
    },
  };

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected schoolMenuService: SchoolMenuService
  ) {
    super(httpClient, backendService);
  }

  /*
 * 下载排课列表
 * */
  public downloadCurriculumSchedule(date: string) {
    const schoolId = this.schoolMenuService.currentSchool.id;
    let url = '/campuses/{school_id}/curriculum_schedules/_download'.replace('{school_id}', schoolId);
    url = url + '?date=' + date;
    return this.httpClient.get(url).pipe(
      map((response: WebApiHttpResponse) => {
        const collection = this.resolve(response.getModel());
        return collection.downloadUrl;
      })
    );
  }

  /*
  * 下载失败明细
  * */
  public downloadFailureDetails(date: string) {
    const schoolId = this.schoolMenuService.currentSchool.id;
    let url = '/campuses/{school_id}/courses_fail_logs/_download'.replace('{school_id}', schoolId);
    url = url + '?time=' + date;
    return this.httpClient.get(url).pipe(
      map((response: WebApiHttpResponse) => {
        const collection = this.resolve(response.getModel());
        return collection.downloadUrl;
      })
    );
  }
  public importCurriculumSchedules(context: CurriculumSchedulesImportExport) {
    const schoolId = this.schoolMenuService.currentSchool.id;
    const param = {
      school_id: schoolId,
      date: context.date,
      file_url: context.attachment.url
    };
    return this.save(param);
  }
}
