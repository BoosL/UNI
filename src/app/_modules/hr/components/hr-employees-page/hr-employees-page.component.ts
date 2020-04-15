import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Renderer2,
  Injector,
  ComponentFactoryResolver,
  forwardRef,
  OnDestroy
} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { IBackendPageComponent, BACKEND_PAGE, OrganizationService, EmployeeService } from '@uni/core';
import { HrOrganization } from '../../models/hr-organization.model';
import { HrOrganizationService } from '../../services/hr-organization.service';
import { HrEmployeeService } from '../../services/hr-employee.service';
import { BehaviorSubject, Subscription, Observable, Subject, forkJoin, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, tap } from 'rxjs/operators';

@Component({
  selector: 'backend-page.employees',
  templateUrl: './hr-employees-page.component.html',
  providers: [
    { provide: BACKEND_PAGE, useExisting: forwardRef(() => HrEmployeesPageComponent) },
    { provide: OrganizationService, useClass: HrOrganizationService },
    { provide: EmployeeService, useClass: HrEmployeeService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HrEmployeesPageComponent extends IBackendPageComponent implements OnInit, OnDestroy {

  searchKeyword: string;
  selectedOrganizationId: string;
  searching: boolean;
  nzSearchValue: string;
  organizations$: Observable<HrOrganization[]>;
  selectedOrganizations$: Observable<HrOrganization[]>;
  employeeFilters$: Observable<{ [name: string]: string | string[] }>;

  // tslint:disable: variable-name
  private _searchSubject = new BehaviorSubject<string>('');
  private _employeeFiltersSubject = new BehaviorSubject<{ [name: string]: string | string[] }>(null);
  private _organizationSelectSubject = new BehaviorSubject<{ organizationId: string, includeParent?: boolean }>(null);
  // private _employeeFiltersSubject = new Subject<{ [name: string]: string | string[] }>();
  private _organizationsSubject = new BehaviorSubject<HrOrganization[]>(null);
  private _selectedOrganizationSubject = new Subject<HrOrganization[]>();
  private _componentSubscription = new Subscription();

  constructor(
    protected renderer2: Renderer2,
    protected injector: Injector,
    protected cfr: ComponentFactoryResolver,
    protected message: NzMessageService,
    protected organizationService: OrganizationService
  ) {
    super(renderer2, injector, cfr);
  }

  ngOnInit() {
    this.selectedOrganizations$ = this._selectedOrganizationSubject.asObservable();
    this.employeeFilters$ = this._employeeFiltersSubject.asObservable();

    this.organizations$ = this.organizationService.getList({ parentId: '', keyword: '' }) as Observable<HrOrganization[]>;
    this._employeeFiltersSubject.next({ parentId: '', keyword: '' });


    /* const searchSubscription = combineLatest(this._searchSubject, this._organizationSelectSubject).pipe(
      map((resultSet) => {
        const filters = { parentId: '', keyword: '', includeParent: '1' };
        filters.keyword = resultSet[0];
        filters.parentId = resultSet[1] ? (resultSet[1].organizationId || '') : '';
        return filters;
      }),
      debounceTime(200),
      distinctUntilChanged((o1, o2) => o1.keyword === o2.keyword && o1.parentId === o2.parentId),
      tap((x) => console.log(x)),
      switchMap((filters: { [name: string]: string | string[] }) => this.organizationService.getList(filters).pipe(
        tap(() => this._filtersSubject.next(filters))
      ))
    ).subscribe(
      (organizations) => {
        console.log(organizations);
        this._organizationsSubject.next(organizations as HrOrganization[]);
        // this._availableEmployeeSourcesSubject.next(availableEmployeeSources as NzTreeNode[]);
        this.nzSearchValue = this.searchKeyword;
      },
      (e) => {
        this.message.error(e.message || '员工或组织架构加载失败');
        // this._availableEmployeeSourcesSubject.next([]);
      }
    );
    this._componentSubscription.add(searchSubscription); */
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  handleSearchChange(_: Event) {
    this._searchSubject.next(this.searchKeyword);
  }

  handleNodeSelect(organization: HrOrganization) {
    if (!organization) { return; }
    this._organizationSelectSubject.next({ organizationId: organization.id, includeParent: false });
  }

  handleExpandCallback = (organization: HrOrganization) => {
    return this.organizationService.getList({ parentId: organization ? organization.id : '', keyword: this.searchKeyword });
  }

}
