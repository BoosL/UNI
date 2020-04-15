import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NgxExcelModelColumnRules, NgxExcelColumnType } from 'ngx-excel';
import { UploadFile } from '../../../models/models';
import { BaseService } from '../../../services/base.service';

@Injectable()
export class QuickLinksService extends BaseService<UploadFile> {

  protected resourceUri = 'help_center/documents';
  protected resourceName = 'documents';

  protected rules = {
    id: {
      label: '文档主键', columnType: NgxExcelColumnType.PrimaryKey
    },
    name: {
      label: '文件名', columnType: NgxExcelColumnType.Text, prop: 'file_name'
    },
    url: {
      label: '下载地址', columnType: NgxExcelColumnType.Text, prop: 'file_url'
    },
    mimeType: {
      label: '文件类型', columnType: NgxExcelColumnType.Text
    }
  } as NgxExcelModelColumnRules<UploadFile>;

  links$ = new BehaviorSubject<any[]>([]);
  // private _linksSubject = new BehaviorSubject<any[]>([]);

  // get links$() {
  // return this._linksSubject as Observable<any[]>;
  // }

}
