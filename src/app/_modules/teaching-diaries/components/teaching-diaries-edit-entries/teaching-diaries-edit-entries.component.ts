import {
  Component,
  OnInit,
  ChangeDetectionStrategy, Input, ViewChild, AfterViewInit,
} from '@angular/core';
import {INgxExcelDataSource, NgxExcelComponent, NgxExcelComponentService} from 'ngx-excel';
import {TeachingDiariesEditEntriesDataService} from '../../services/teaching-diaries-edit-entries-data.service';
import {TeachingDiaryEntry, TeachingDiaryModel} from '../../model/teaching-diary.model';
import {TeachingDiariesEditEntriesComponentService} from '../../services/teaching-diaries-edit-entries-component.service';
import {Observable} from "rxjs";

@Component({
  selector: 'teaching-diaries-edit-entries',
  templateUrl: './teaching-diaries-edit-entries.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: INgxExcelDataSource, useExisting: TeachingDiariesEditEntriesDataService },
    { provide: NgxExcelComponentService, useClass: TeachingDiariesEditEntriesComponentService }
  ]
})
export class TeachingDiariesEditEntriesComponent implements OnInit, AfterViewInit {
  @Input() taskExtSubject: Observable<TeachingDiaryEntry[]>;
  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

  constructor(
    protected excel: TeachingDiariesEditEntriesDataService,
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.taskExtSubject.subscribe( (data) => {
      this.excel.bindDataSet(data);
      this.excelComponent.reload();
    });
  }
}
