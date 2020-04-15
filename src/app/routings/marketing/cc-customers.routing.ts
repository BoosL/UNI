import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarketingCustomerService } from '@uni/customer';
import {MarketingCustomerForCcService} from '../../_modules/customers/services/marketing-customer-for-cc.service';
import {
  CustomersPageComponent,
  CustomerPageComponent,
  CustomersModule,
  CustomerConsultingRecordPageComponent
} from 'src/app/_modules/customers/customers';

const routes: Routes = [
  { path: '', component: CustomersPageComponent },
  { path: ':customerId', component: CustomerPageComponent  },
  { path: '_consulting/:customerId', component: CustomerConsultingRecordPageComponent  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CustomersModule
  ],
  exports: [
    RouterModule
  ],
  providers: [
    { provide: MarketingCustomerService, useClass: MarketingCustomerForCcService }
  ]
})
export class CcCustomerRoutingModule { }
