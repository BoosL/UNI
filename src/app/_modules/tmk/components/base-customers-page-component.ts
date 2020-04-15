import { OnInit, Renderer2, ComponentFactoryResolver, Injector, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import {
  IBackendPageComponent, EmployeeMenuService,
  SchoolMenuService
} from '@uni/core';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { TmkCustomer } from '../models/tmk-customer.model';
import { TmkCustomersSearch } from '../models/tmk-customers-search.model';
import {camelCase, upperCase} from 'change-case';

export abstract class BaseCustomersPageComponent extends IBackendPageComponent implements OnInit, OnDestroy {
  public extraFilters$ = new BehaviorSubject<any>(null);
  // tslint:disable: variable-name
  protected _componentSubscription = new Subscription();
  protected _searchConditions: TmkCustomersSearch;
  protected _selectCustomers: TmkCustomer[];
  protected _schoolId: string;
  protected _subordinateStaffId: string;
  protected _tag: string;

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected renderer: Renderer2,
    protected injector: Injector,
    protected cfr: ComponentFactoryResolver,
    protected message: NzMessageService,
    protected schoolMenuService: SchoolMenuService,
    protected employeeMenuService: EmployeeMenuService,
    protected changeDetectorRef: ChangeDetectorRef,
  ) {
    super(renderer, injector, cfr);
  }

  ngOnInit() {
    const condition = combineLatest(
      this.activatedRoute.params,
      this.schoolMenuService.currentSchool$,
      this.employeeMenuService.currentEmployeeMenu$).pipe(
        map((params) => {
          const _schoolId = params[1] ? params[1].id : '';
          const _tmkId = params[2] ? params[2].id : '';
          let _tag = params[0] ? params[0].tag : '';
          if (((this._schoolId && _schoolId !== this._schoolId) || (this._subordinateStaffId && _tmkId !== this._subordinateStaffId)) && this._tag) {
            this.router.navigate(['.', {}], { relativeTo: this.activatedRoute });
            _tag = '';
          }
          return {
            tag: _tag,
            schoolId: _schoolId,
            tmkId: _tmkId
          };
        }),
        distinctUntilChanged(),
        tap(({ tag, schoolId, tmkId }) => {
          this._tag = camelCase(tag);
          this._schoolId = schoolId;
          this._subordinateStaffId = tmkId;
        })
      ).subscribe((params) => {
        this._searchConditions = null;
        this._reloadCustomers();
      }
      );
    this._componentSubscription.add(condition);
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }
  protected _reloadCustomers() { }
  /*
* 更改行选择
* */
  public handleChangeSelect(customers: TmkCustomer[]) {
    this._selectCustomers = customers;
    this.changeDetectorRef.detectChanges();
  }

}
