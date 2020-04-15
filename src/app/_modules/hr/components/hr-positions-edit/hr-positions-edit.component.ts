import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd';
import {
  INgxExcelDataSource,
  NgxExcelModelColumnRules,
} from 'ngx-excel';
import { delay, map, tap, mergeMap } from 'rxjs/operators';
import { Position } from '@uni/core';
import { of } from 'rxjs';
import { HrPositionService } from '../../services/hr-positions.service';
import { HrPositions } from '../../models/hr-position.model';

@Component({
  selector: 'hr-positions-edit',
  templateUrl: './hr-positions-edit.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: HrPositionService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HrPositionsEditComponent implements OnInit {

  rules: NgxExcelModelColumnRules<HrPositions>;
  loading = false;
  message = '';

  componentValue: Position;


  constructor(
    protected cdr: ChangeDetectorRef,
    protected drawRef: NzDrawerRef<Position>,
    protected hrPositionService: HrPositionService
  ) { }

  ngOnInit() {
    this.componentValue = this.hrPositionService.createModel();
    this.rules = this.hrPositionService.getRules();
  }


  /**
   * 当表单提交时执行
   */
  confirm() {
    of(null).pipe(
      delay(200),
      map(() => ({
        position_name: this.componentValue.name,
        position_type: this.componentValue.type['value']
      })),
      tap(() => {
        this.loading = true;
        this.cdr.detectChanges();
      }),
      mergeMap((payload) => this.hrPositionService.save(payload))
    ).subscribe(
      (customerWhitelist) => {
        this.drawRef.close(customerWhitelist);
      },
      (e) => {
        this.loading = false;
        this.message = e.message || '系统错误，请联系管理员';
        this.cdr.detectChanges();
      }
    );
  }

  dismiss() {
    this.drawRef.close();
  }

}
