import { Injectable } from '@angular/core';
import { CustomerSourceStatelessService } from '@uni/customer';

@Injectable({ providedIn: 'root' })
export class TmkEmployeeSourceService extends CustomerSourceStatelessService {

  protected resourceUri = 'v2/tmk/sources';
  protected resourceName = 'sources';

  /**
   * @inheritdoc
   * cacheKey = employeeId + '-' + firstSourceId + ...
   */
  protected getPrefixCacheKey(filters?: { [name: string]: string | string[]; }) {
    const employeeId = filters.employeeId || '';
    return `${employeeId}`;
  }

}
