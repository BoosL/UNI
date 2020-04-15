import {Injectable} from '@angular/core';
import {MarketingCustomerService} from '@uni/customer';

@Injectable({ providedIn: 'root' })
export class MarketingCustomerForUsherService extends MarketingCustomerService {

  protected resourceUri = 'v2/customer/usher/customers';
  protected resourceName = 'customers';
  protected scheme = 'US';

}
