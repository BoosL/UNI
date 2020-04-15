import {BaseService, BackendService, StudentService, SchoolService} from '@uni/core';
import {NgxExcelColumnType} from 'ngx-excel';
import {EntrySigningStudentModel} from '../models/entry-student.model';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
@Injectable({providedIn: 'root'})
export class SignClassService extends BaseService<EntrySigningStudentModel> {
  protected resourceUri = '/curriculum_schedules/{schedule_id}/sign_classes';
  protected resourceName = '';
  protected rules = {
    attachmentUrl: { label: '#', columnType: NgxExcelColumnType.Text },
    productType: { label: '排课类型', columnType: NgxExcelColumnType.Text },
  };

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
  ) {
    super(httpClient, backendService);
  }
}
