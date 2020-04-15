import { Injectable } from '@angular/core';
import {ContractDto} from '../../models/contract-dto.model';
import {ContractDtoService} from '../../services/contract-dto.service';
import { map } from 'rxjs/operators';

@Injectable()
export class ContractComponentService {

  constructor(
    protected contractService: ContractDtoService
  ) { }

  public canDeleteContract(model: ContractDto, action: string): boolean {
    // 状态为0，1，4可删除
    return (['0', '1', '4'].indexOf(model.status.value.toString()) >= 0) ? true : false;
  }


  /**
   * 删除合同
   * @param model 待删除的合同
   */
  public deleteContract(model: ContractDto & { studentId: string }) {
    return this.contractService.batchDestroy(
      Object.assign({}, { studentId: model.studentId, contractId: model.id }),
    ).pipe(
      map((contracts: ContractDto[]) => {
        return [{ action: 'destoryed', contexts: contracts }];
      })
    );
  }


}
