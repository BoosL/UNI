import {Injectable} from '@angular/core';
import {NgxExcelModelColumnRules, NgxExcelColumnType, NgxExcelService} from 'ngx-excel';
import {
  BaseService,
  CustomerSource
} from '@uni/core';
import {isArray} from 'util';
import {Observable, throwError, of} from 'rxjs';
import {tap, map} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CustomerSourceStatelessService extends BaseService<CustomerSource> {

  protected resourceUri = 'v2/customer/sources';
  protected resourceName = 'sources';

  protected rules = {
    id: { label: '渠道主键', columnType: NgxExcelColumnType.PrimaryKey, prop: 'source_id' },
    name: { label: '渠道名称', columnType: NgxExcelColumnType.Text, prop: 'source_name' },
    children: {
      label: '下级渠道列表', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this as NgxExcelService<CustomerSource>, labelKey: 'name',
      resolveValue: (o: any, _: Partial<CustomerSource>) => this.resolveChildren(o),
      optional: true
    }
  } as NgxExcelModelColumnRules<CustomerSource>;

  protected cachedSchoolSourceMap: { [cacheKey: string]: CustomerSource[] } = {};

  protected resolveChildren(o: any) {
    return o.children && isArray(o.children) ? (o.children as any[]).map((child) => this.createModel(null, child)) : [];
  }

  /**
   * 获得模型列表的资源响应
   * @param filters 请求列表筛选参数
   */
  public getList(filters?: { [name: string]: string | string[]; }): Observable<CustomerSource[]> {
    try {
      const prefixCachedKey = this.getPrefixCacheKey(filters);
      const cachedSources = this.tryToGetSourcesFromCache(filters);
      return (
        cachedSources.length > 0 ? of(cachedSources) : super.getList(
          Object.assign({}, filters, { campus_id: filters.schoolId || '', staff_id: filters.employeeId || '' })
        ).pipe(
          tap((sources) => this.flattenSourcesToCache(sources, prefixCachedKey)),
          map(() => this.tryToGetSourcesFromCache(filters))
        )
      ).pipe(
        map(
          (sources) => filters.name ? sources.filter((source) => source.name.indexOf(filters.name as string) >= 0) : sources
        )
      );
    } catch (e) {
      return throwError(e);
    }
  }

  /**
   * 尝试从缓存中获得客户渠道列表
   * @param filters 过滤参数
   */
  protected tryToGetSourcesFromCache(filters?: { [name: string]: string | string[] }): CustomerSource[] {
    const relativeFirstSourceId = filters.relativeFirstSourceId || '';
    const relativeSecondSourceId = filters.relativeSecondSourceId || '';
    const level = parseInt((filters.level || '0') as string, 10);
    let cacheKey = this.getPrefixCacheKey(filters);

    // let cachedKey = `${employeeId}-${schoolId}-${contactType}`;
    if (level === 2) {
      cacheKey += `-${relativeFirstSourceId}-${relativeSecondSourceId}`;
    } else if (level === 1) {
      cacheKey += `-${relativeFirstSourceId}`;
    }

    return this.cachedSchoolSourceMap[cacheKey] || [];
  }

  /**
   * 平铺客户渠道并缓存
   * @param sources 渠道列表
   * @param prefixCacheKey 缓存键前缀
   */
  protected flattenSourcesToCache(sources: CustomerSource[], prefixCacheKey: string) {
    sources.forEach((source) => {
      if (source.children && source.children.length > 0) {
        this.flattenSourcesToCache(source.children, prefixCacheKey + `-${source.id}`);
      }
      if (!this.cachedSchoolSourceMap[prefixCacheKey]) {
        this.cachedSchoolSourceMap[prefixCacheKey] = [];
      }
      const obj = this.cachedSchoolSourceMap[prefixCacheKey].filter((item) => item.id === source.id);
      if (!obj || obj.length <= 0) {
        this.cachedSchoolSourceMap[prefixCacheKey].push(source);
      }
    });
  }

  /**
   * 根据过滤参数获得缓存前缀
   * @param filters 过滤参数
   */
  protected getPrefixCacheKey(filters?: { [name: string]: string | string[]; }) {
    const schoolId = filters.schoolId;
    return `${schoolId || 0}`;
  }

}
