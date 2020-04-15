import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebApiHttpResponse } from '@uni/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SoCustomerStatsService {

  constructor(
    protected httpClient: HttpClient
  ) { }

  reload(filters?: { [name: string]: string | string[] }): Observable<Array<{ [name: string]: string | number }>> {
    const params = filters || {};
    return this.httpClient.get('v2/customer/source/statistics', { params }).pipe(
      map((response: WebApiHttpResponse) => response.getCollection('source_staff_statistics'))
      /* map((response: WebApiHttpResponse) => {
        const collection = response.getCollection('source_staff_statistics');
        const dictionary = {};
        collection.forEach(({ name, value }) => {
          const itemKey = name || null;
          const itemValue = value || 0;
          if (itemKey === null) { return; }
          dictionary[itemKey] = parseInt(itemValue, 10);
        });
        return dictionary;
      }) */
    );
  }

}
