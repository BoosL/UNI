import { Component, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { IBackendPageComponent, BACKEND_PAGE } from '../shared/components/page/interfaces/page.component';

@Component({
  selector: 'backend-page.dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: BACKEND_PAGE, useExisting: forwardRef(() => DashboardComponent) }
  ]
})
export class DashboardComponent extends IBackendPageComponent { }
