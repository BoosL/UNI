import {Injectable} from '@angular/core';
import {NgxExcelComponentService} from 'ngx-excel';
import {TeachingDiaryEntry} from '../model/teaching-diary.model';
import {of} from 'rxjs';
import {TeachingDiariesService} from '../_services/teaching-diaries.service';

@Injectable()
export class TeachingDiariesEditEntriesComponentService extends NgxExcelComponentService {

  constructor(
    protected teachingDiariesService: TeachingDiariesService,
  ) {
    super();
  }
  public handleTaskSituationChanged(newModel: TeachingDiaryEntry, model: TeachingDiaryEntry) {
    this.teachingDiariesService.handleTaskSituationChange(model);
    return of([{ action: 'updated', context: model}]);
  }
}
