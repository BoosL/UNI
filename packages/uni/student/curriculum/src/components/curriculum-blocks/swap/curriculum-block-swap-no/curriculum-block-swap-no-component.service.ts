import { Injectable } from '@angular/core';
import { NgxExcelComponentService } from 'ngx-excel';
import { CurriculumBlockSwapNoNode } from '../curriculum-block-swap.model';
import { Subject, Observable, of } from 'rxjs';

@Injectable()
export class CurriculumBlockSwapNoComponentService extends NgxExcelComponentService {

  protected relativeSubjectIdChangeSubject = new Subject<string>();

  public getRelativeSubjectIdChangeStream(): Observable<string> {
    return this.relativeSubjectIdChangeSubject.asObservable();
  }

  public handleRelativeSubjectChange(_: CurriculumBlockSwapNoNode, currentModel: CurriculumBlockSwapNoNode) {
    this.relativeSubjectIdChangeSubject.next(currentModel.relativeSubject.id);
    return of([{ action: 'updated', context: Object.assign({}, currentModel) }]);
  }

}
