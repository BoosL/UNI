import { Component, OnInit, ChangeDetectionStrategy, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { WebApiHttpResponse } from '@uni/common';
import { NzMessageService } from 'ng-zorro-antd';
import { INgxExcelDataSource } from 'ngx-excel';
import { CustomerImportUpDownloadService } from '../../services/customer-import-up-download.service';

@Component({
  selector: 'customer-import-upload',
  templateUrl: './customer-import-upload.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: CustomerImportUpDownloadService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerImportUploadComponent implements OnInit, AfterViewInit {

  @Input() canUpload: boolean;
  @Output() actionButtonClick = new EventEmitter<string>();

  constructor(
    protected message: NzMessageService,
    protected customerImportUpDownloadService: CustomerImportUpDownloadService
  ) { }

  ngOnInit() {
    this.canUpload = true;
  }

  ngAfterViewInit() { }


  handleChange({ file, type }) {
    if (type === 'start') {
      this.message.loading('文件上传中，请稍候...', { nzDuration: 0 });
      return;
    }
    if (type === 'error') {
      this.message.remove();
      if (file.error.error instanceof HttpErrorResponse) {
        this.message.error(file.error.error.error.message || '文件上传错误');
      } else {
        this.message.error('文件上传错误');
      }
      return;
    }
    if (type !== 'success' || !(file.response instanceof WebApiHttpResponse)) { return; }
    this.message.remove();
    const fileUrl = (file.response as WebApiHttpResponse).getModel<string>((o) => o.file_url);
    this.actionButtonClick.emit(fileUrl);
  }
}

