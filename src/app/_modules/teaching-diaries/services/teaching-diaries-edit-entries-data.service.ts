import {Injectable} from '@angular/core';
import {NgxExcelDataService} from 'ngx-excel';
import {TeachingDiaryEntry} from '../model/teaching-diary.model';
import {TeachingDiariesEntryService} from '../_services/teaching-diaries.service';

@Injectable()
export class TeachingDiariesEditEntriesDataService extends NgxExcelDataService<TeachingDiaryEntry> {


  constructor(
    protected teachingDiariesEntryService: TeachingDiariesEntryService,
  ) {
    super();
  }

  /**
   * @inheritdoc
   */
  public getRules() {
    return this.teachingDiariesEntryService.getRules();
  }

}
