import { Injectable } from '@angular/core';
import { NgxExcelModelColumnRules, NgxExcelColumnType } from 'ngx-excel';
import { Organization, OrganizationService } from '@uni/core';
import { HrOrganization } from '../models/hr-organization.model';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class HrOrganizationService extends OrganizationService {

  protected resourceUri = 'v2/organization';
  protected resourceName = 'organization';

  protected additionalRules = {
    idPath: {
      label: '组织关系主键链', columnType: NgxExcelColumnType.Text, prop: 'id_path',
      resolveValue: (o: any) => this.resolveIdPath(o)
    },
    hasChildren: {
      label: '是否有下级组织？', columnType: NgxExcelColumnType.Bool
    },
  } as NgxExcelModelColumnRules<HrOrganization>;

  // tslint:disable-next-line: variable-name
  private _allOrganizations: HrOrganization[];

  protected resolveIdPath(o: any) {
    if (!o.id_path) { return ''; }
    const idPaths = o.id_path.split('//').filter((idPath: string) => idPath.length > 0);
    return idPaths.join('-');
  }

  protected resolveName(o: any) {
    if (!o.name_path) { return ''; }
    const namePaths = o.name_path.split('//').filter((namePath: string) => namePath.length > 0);
    return namePaths.join(' / ');
  }

  /**
   * @inheritdoc
   */
  public getList(filters?: { [name: string]: string | string[]; }): Observable<HrOrganization[]> {
    return (this._allOrganizations ? of(this._allOrganizations) : super.getList().pipe(
      map((organizations) => this._organizations2HrOrganizations(organizations)),
      tap((organizations) => this._allOrganizations = organizations)
    )).pipe(
      map((organizations) => {
        if (filters.parentId === undefined) { return organizations; }
        const filteredOrganizations = organizations.filter((organization) => organization.parentId === filters.parentId);
        if (filters.parentId === '') {
          const parentIds = filteredOrganizations.map((filteredOrganization) => filteredOrganization.id);
          filteredOrganizations.push(...organizations.filter((organization) => parentIds.indexOf(organization.parentId) >= 0));
        }
        return filteredOrganizations;
      })
    );
  }

  private _organizations2HrOrganizations(organizations: Organization[]): HrOrganization[] {
    return organizations.map((organization) => {
      const model = Object.assign({}, organization) as HrOrganization;
      model.hasChildren = organizations.some((child) => child.parentId === organization.id);
      return model;
    });
  }

}
