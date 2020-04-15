import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { INgxExcelDataSource, NgxExcelComponent } from 'ngx-excel';
import { ProductCurriculumService } from '@uni/core';

@Component({
  selector: 'curriculums',
  templateUrl: './curriculums.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: ProductCurriculumService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurriculumsComponent implements OnInit, AfterViewInit {

  showHelper = true;

  @Input() filters$: Observable<{ [name: string]: string | string[] }>;
  @ViewChild(NgxExcelComponent, { static: false }) protected excelComponent: NgxExcelComponent;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected curriculumService: ProductCurriculumService
  ) { }

  ngOnInit() { }

  ngAfterViewInit() {
    if (!this.filters$) { return; }
    this.filters$.subscribe((filters) => {
      if (!filters) {
        this.showHelper = true;
        this.cdr.detectChanges();
      } else {
        this.showHelper = false;
        this.excelComponent.bindFilters(filters).reload();
        this.cdr.detectChanges();
      }
    });
  }
}
