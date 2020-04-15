import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  AfterViewInit,
  Input,
} from '@angular/core';
import {NzDrawerRef} from 'ng-zorro-antd';
import {INgxExcelDataSource, NgxExcelComponent} from 'ngx-excel';
import {FailureDetailService} from '../../_services/failure-detail.service';
import {FailureDetail} from '../../models/failure-detail';

@Component({
  selector: 'curriculum-schedules-failure-details',
  templateUrl: './curriculum-schedules-failure-details.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: FailureDetailService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurriculumSchedulesFailureDetailsComponent implements AfterViewInit {
  @Input() extraFilters: { [name: string]: string };
  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

  constructor(
    protected drawRef: NzDrawerRef<boolean>,
  ) {
  }

  ngAfterViewInit() {
    this.excelComponent.bindFilters(this.extraFilters).reload();
  }

  public getCurriculumInfo(context: FailureDetail) {
    let str = '';
    if (context.product) {
      str = context.product.name;
    }
    if (context.subject) {
      str = str + '-' + context.subject.name;
    }
    if (context.curriculum) {
      str = str + '-' + context.curriculum.name;
    }
    return str;
  }

  public handleDownload() {
    this.drawRef.close(true);
  }

  // 关闭抽屉
  public dismiss() {
    this.drawRef.close();
  }

}
