import { Injectable, Optional } from '@angular/core';
import { CustomerTimelineService } from '@uni/customer';

@Injectable({ providedIn: 'root' })
export class TmkCustomersTimelineService extends CustomerTimelineService {

  protected resourceUri = 'v2/tmk/customers/{customer_id}/events';
  protected resourceName = 'customer_event_logs';

}
