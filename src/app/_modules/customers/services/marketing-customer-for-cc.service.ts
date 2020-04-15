import { Injectable } from '@angular/core';
import { MarketingCustomerService } from '@uni/customer';

@Injectable({ providedIn: 'root' })
export class MarketingCustomerForCcService extends MarketingCustomerService {

  protected resourceUri = 'v2/customer/cc/customers';
  protected resourceName = 'customers';
  protected scheme = 'CC';

}
