import { Injectable } from '@angular/core';
import { NgxExcelColumnType } from 'ngx-excel';
import { UploadModel } from '../models/customer-import.model';
import { BaseService, BackendService } from '@uni/core';
import { WebApiHttpResponse } from '@uni/common/public-api';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CustomerImportUpDownloadService extends BaseService<UploadModel> {

  protected resourceUri = 'documents/_upload';
  protected resourceName = 'data';
  protected rules = {
    uploadUrl: { label: '客户上传模板地址', columnType: NgxExcelColumnType.Text, }
  };

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
  ) {
    super(httpClient, backendService);
  }



  download() {
    return this.httpClient.get('v2/customer/excel_download').pipe(
      map((response: WebApiHttpResponse) => {
        const collection = response.getCollection('download_url');
        return collection;
      })
    );
  }

}
