import { Injectable, OnInit } from '@angular/core';
import { TmkCustomersService } from './tmk-customers.service';

@Injectable({ providedIn: 'root' })
export class TmkCustomersPublicService extends TmkCustomersService {

  // protected resourceUri = 'v2/tmk/customers/public';
  protected resourceUri = 'v2/tmk/customers/public';
  protected resourceName = 'customers';

}
