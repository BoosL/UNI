import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  forwardRef,
  ViewChild,
  Renderer2,
  ComponentFactoryResolver,
  Injector,
} from '@angular/core';
import {
  SchoolMenuService,
  BACKEND_PAGE,
  IBackendPageComponent,
} from '@uni/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzDrawerService, NzMessageService } from 'ng-zorro-antd';
import { INgxExcelDataSource, NgxExcelComponent } from 'ngx-excel';
import { Subscription, BehaviorSubject } from 'rxjs';
import { CustomerImport, DownloadModel } from '../../models/customer-import.model';
import { CustomerImportService } from '../../services/customer-import.service';
import { CustomerImportUpDownloadService } from '../../services/customer-import-up-download.service';
import { CustomerImportDataService } from '../../services/customer-importdata.service';


@Component({
  selector: 'backend-page.customer-import',
  templateUrl: './customer-import-page.component.html',
  providers: [
    { provide: BACKEND_PAGE, useExisting: forwardRef(() => CustomerImportPageComponent) },
    { provide: INgxExcelDataSource, useExisting: CustomerImportService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerImportPageComponent extends IBackendPageComponent implements OnInit, AfterViewInit, OnDestroy {

  downloadUrl: any;
  customer$ = new BehaviorSubject<CustomerImport[]>(null);
  canUpload: boolean;

  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();

  @ViewChild(NgxExcelComponent, { static: false }) private excelComponent: NgxExcelComponent;

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected cdr: ChangeDetectorRef,
    protected renderer2: Renderer2,
    protected injector: Injector,
    protected cfr: ComponentFactoryResolver,
    protected drawer: NzDrawerService,
    protected message: NzMessageService,
    protected schoolMenuService: SchoolMenuService,
    protected customerImportService: CustomerImportService,
    protected customerImportUpDownloadService: CustomerImportUpDownloadService,
    protected customerImportDataService: CustomerImportDataService
  ) {
    super(renderer2, injector, cfr);
  }

  ngOnInit() { }


  ngAfterViewInit() {
    const metaChangeSubscription = this.excelComponent.bindMetas('is_implement').subscribe((meta) => {
      this.canUpload = meta.is_implement !== 0;
      this.cdr.detectChanges();
    });
    this._componentSubscription.add(metaChangeSubscription);
    this.excelComponent.reload();
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  /*
   * 下载导入客户模板
  */
  public handleDownButtonClick(_e: Event) {
    this.customerImportUpDownloadService.download().subscribe((res: DownloadModel[]) => {
      const downloadUrl = res[0].download_url;
      window.open(downloadUrl);
    });
  }

  /*
   * 手动刷新列表
  */
  public handleRefreshButtonClick(_e: Event) {
    this.excelComponent.reload();
  }


  /*
 * 上传导入文件
*/
  onDecideClick(url: string) {
    this.message.loading('文件验证中，请稍候...', { nzDuration: 0 });
    this.customerImportDataService.save(
      Object.assign('', { file_url: url })
    ).subscribe(
      () => {
        this.canUpload = false;
        this.cdr.detectChanges();
        this.message.remove();
        this.message.success('文件验证成功，请耐心等待数据导入...');
        this.excelComponent.reload();
      },
      (e) => {
        this.canUpload = true;
        this.cdr.detectChanges();
        this.message.remove();
        this.message.error(e.message || '系统错误，请联系管理员');
      }
    );
  }
}
