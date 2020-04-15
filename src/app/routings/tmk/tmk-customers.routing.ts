import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  TmkCustomerPageComponent,
  TmkModule, TmkCustomersPageComponent,
} from 'src/app/_modules/tmk/tmk';
import { MarketingCustomerService, CustomerTimelineService } from '@uni/customer';
import { TmkCustomersService } from '../../_modules/tmk/services/tmk-customers.service';
import { TmkCustomersTimelineService } from '../../_modules/tmk/services/tmk-customers-timeline.service';

const routes: Routes = [
  { path: '', component: TmkCustomersPageComponent },
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
export class TmkCustomersRouting { }
