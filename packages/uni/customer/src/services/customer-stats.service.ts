import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebApiHttpResponse } from '@uni/common';
import { map } from 'rxjs/operators';

@Injectable()
export class CustomerStatsService {

  constructor(
    protected httpClient: HttpClient
  ) { }

  reload(filters?: { [name: string]: string | string[] }) {
    const params = filters || {};
    return this.httpClient.get('v2/customer/source/cc_statistics', { params }).pipe(
      map((response: WebApiHttpResponse) => {
        const collection = response.getCollection('cc_statistics');
        const dictionary = {};
        collection.forEach(({ name, value }) => {
          const itemKey = name || null;
          const itemValue = value || 0;
          if (itemKey === null) { return; }
          dictionary[itemKey] = parseInt(itemValue, 10);
        });
        return dictionary;
      })
    );
  }

}
