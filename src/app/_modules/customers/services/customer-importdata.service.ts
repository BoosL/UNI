import { Injectable } from '@angular/core';
import { NgxExcelColumnType } from 'ngx-excel';
import { UploadModel } from '../models/customer-import.model';
import { BaseService, BackendService } from '@uni/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CustomerImportDataService extends BaseService<UploadModel> {

  protected resourceUri = 'v2/customer/import_data';
  protected resourceName = '';
  protected rules = {
    uploadUrl: { label: '客户数据导入地址', columnType: NgxExcelColumnType.Text, }
  };

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
  ) {
    super(httpClient, backendService);
  }


}
