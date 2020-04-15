import { HttpClient } from '@angular/common/http';
import { NgxExcelService } from 'ngx-excel';
import { BackendService } from './backend.service';

export abstract class BaseService<T> extends NgxExcelService<T> {

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService
  ) {
    super(httpClient, backendService);
  }

}
