import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { SchoolMenuService } from '@uni/core';


@Component({
  selector: 'students-cc-follows-records-check',
  templateUrl: './students-cc-follows-records-check.component.html',
  providers: [
    // { provide: INgxExcelDataSource, useExisting: HelpCenterDocumentsSearchService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentCcFollowsRecordsCheckComponent implements OnInit, OnDestroy {


  @Input() context: any;


  constructor(
    protected message: NzMessageService,
    protected modalRef: NzModalRef,
    protected schoolMenuService: SchoolMenuService,
  ) { }

  ngOnInit() { }

  ngOnDestroy() {
  }

  close(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.modalRef.close(null);
  }



}

