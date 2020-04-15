import {Injectable} from '@angular/core';
import {MarketingCustomerService} from '@uni/customer';

@Injectable({ providedIn: 'root' })
export class MarketingCustomerForSourceService extends MarketingCustomerService {

  protected resourceUri = 'v2/customer/source/customers';
  protected resourceName = 'customers';
  protected scheme = 'SO';

}
