import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  forwardRef,
  Renderer2,
  Injector,
  ComponentFactoryResolver,
  AfterViewInit
} from '@angular/core';
import { IBackendPageComponent, BACKEND_PAGE, OrganizationService, Organization } from '@uni/core';
import { HrOrganizationService } from '../../services/hr-organization.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'backend-page.organizations',
  templateUrl: './hr-organizations-page.component.html',
  providers: [
    { provide: OrganizationService, useClass: HrOrganizationService },
    { provide: BACKEND_PAGE, useExisting: forwardRef(() => HrOrganizationsPageComponent) }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HrOrganizationsPageComponent extends IBackendPageComponent implements OnInit, AfterViewInit {

  organizations$: Observable<Organization[]>;

  constructor(
    protected renderer2: Renderer2,
    protected injector: Injector,
    protected cfr: ComponentFactoryResolver,
    protected organizationService: OrganizationService
  ) {
    super(renderer2, injector, cfr);
  }

  ngOnInit() {
    this.organizations$ = this.organizationService.getList();
  }

  ngAfterViewInit() { }

  handleNodeExpand = (organization?: Organization) => this.organizationService.getList({ parentId: organization ? organization.id : '' });

}
