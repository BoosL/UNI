import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { SelectOption } from '@uni/core';
import { INgxExcelDataSource } from 'ngx-excel';

@Component({
  selector: 'curriculum-block-extra',
  templateUrl: './curriculum-block-extra.component.html',
  providers: [ ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurriculumBlockExtraComponent implements OnInit {

  @Input() productType: SelectOption;

  constructor() { }

  ngOnInit() { }
}
