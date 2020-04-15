import { Injectable } from '@angular/core';
import { NgxExcelComponentService } from 'ngx-excel';
import { HrPositions } from '../../models/hr-position.model';
import { HrPositionService } from '../../services/hr-positions.service';
import { map } from 'rxjs/operators';


@Injectable()
export class HrPositionsPageComponentService extends NgxExcelComponentService {

  public autoCommitKeys = ['name', 'type'] as Array<keyof HrPositions>;

  constructor(
    protected hrPositionService: HrPositionService
  ) {
    super();
  }


  public canDeletePosition(model: HrPositions, action: string): boolean {
    return !model || model.count === 0;
  }

  /**
   * 删除职位
   */
  public deletePosition(model: HrPositions) {
    return this.hrPositionService.destroy(
      model.id
    ).pipe(
      map((studentContracts: HrPositions) => {
        return [{ action: 'destoryed', contexts: studentContracts }];
      })
    );
  }
}
