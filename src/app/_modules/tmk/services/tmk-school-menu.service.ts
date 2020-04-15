import { Injectable } from '@angular/core';
import { SchoolMenuService, School } from '@uni/core';
import { map } from 'rxjs/operators';

@Injectable()
export class TmkSchoolMenuService extends SchoolMenuService {

  /**
   * @inheritdoc
   */
  protected getAvailableMenuItems() {
    return super.getAvailableMenuItems().pipe(
      map((schoolMenuItems) => [
        this.getDefaultSelectedMenuItem(),
        ...schoolMenuItems
      ])
    );
  }

  /**
   * @inheritdoc
   */
  protected getDefaultSelectedMenuItem() {
    return { id: '-1', name: '所有校区视角', nameCn: '所有校区视角', nameEn: 'All' } as School;
  }

}
