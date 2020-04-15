import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarketingDashboardComponent, CustomersModule } from 'src/app/_modules/customers/customers';

const routes: Routes = [
  { path: '', component: MarketingDashboardComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CustomersModule
  ],
  exports: [
    RouterModule
  ]
})
export class DashboardRoutingModule {}

