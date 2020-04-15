import { Injectable } from '@angular/core';
import { NgxExcelComponentService } from 'ngx-excel';

@Injectable()
export class StudnetPrimaryClassEditUczeComponentService extends NgxExcelComponentService {
  autoCommitKeys = ['student', 'product', 'remark'];
}
