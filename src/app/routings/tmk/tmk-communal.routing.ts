import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerTimelineService } from '@uni/customer';

import {
  TmkModule,
  TmkCustomersCommunalPageComponent,
  TmkCustomerPageComponent
} from 'src/app/_modules/tmk/tmk';
import { TmkCustomersTimelineService } from 'src/app/_modules/tmk/services/tmk-customers-timeline.service';
import { TmkCustomersPublicService } from 'src/app/_modules/tmk/services/tmk-customers-public.service';
import { TmkCustomersService } from 'src/app/_modules/tmk/services/tmk-customers.service';
import {MarketingCustomerService} from '@uni/customer';

const routes: Routes = [
  { path: '', component: TmkCustomersCommunalPageComponent },
  { path: ':customerId', component: TmkCustomerPageComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TmkModule
  ],
  exports: [
    RouterModule
  ],
  providers: [
    { provide: MarketingCustomerService, useClass: TmkCustomersService },
    { provide: CustomerTimelineService, useClass: TmkCustomersTimelineService }
  ]
})
export class TmkCommunalPoolRoutingModule { }
