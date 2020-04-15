import {Injectable} from '@angular/core';
import {MarketingCustomerService} from './marketing-customer.service';

@Injectable({ providedIn: 'root' })
export class MarketingCustomerStatelessService extends MarketingCustomerService {

  protected resourceUri = 'v2/customer/all_customers';
  protected resourceName = 'customers';

}
