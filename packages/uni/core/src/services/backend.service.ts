import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpResponse, HttpRequest, HttpEvent } from '@angular/common/http';
import { IAuthHelper, WebApiHttpResponse } from '@uni/common';
import { UploadXHRArgs, UploadFile as AntUploadFile } from 'ng-zorro-antd';
import { NgxExcelHelper, NgxExcelHttpResponse, NgxExcelUploadService } from 'ngx-excel';
import { SelectOption, RequestMethod, UploadFile } from '../models/models';
import { BACKEND_CONFIG, IBackendConfig } from '../backend.config';
import { Observable, BehaviorSubject, of, forkJoin } from 'rxjs';
import { tap, map, mergeMap, catchError } from 'rxjs/operators';
import { utc } from 'moment';
import * as lodash from 'lodash';

@Injectable()
export class BackendService extends NgxExcelHelper implements IAuthHelper {

  private _readySubject = new BehaviorSubject<boolean>(false);
  private _currentUser: any = null;
  private _allPermissionMap: { [apiUrl: string]: RequestMethod[] } = {};

  constructor(
    protected httpClient: HttpClient,
    @Inject(BACKEND_CONFIG) protected appConfig: IBackendConfig
  ) {
    super();
  }

  /**
   * 当成功登陆之后执行
   * @param _payload 登陆接口回传的数据
   */
  public loginCallback(_payload: any): Observable<boolean> {
    // return this.loginValidCallback();
    return of(true);
  }

  /**
   * 当成功登出之后执行
   */
  public logoutCallback(): Observable<boolean> {
    return of(true).pipe(
      tap(() => {
        this._currentUser = null;
        this._allPermissionMap = {};
      }));
  }

  /**
   * 当登陆TOKEN验证有效之后执行
   */
  public loginValidCallback(): Observable<boolean> {
    return forkJoin(this._loadCurrentUser(), this._loadPermissions()).pipe(
      map((result) => result.every((success) => !!success))
    );
  }

  /**
   * 获得当前登陆用户信息
   */
  public getCurrentUser(): any {
    return this._currentUser;
  }

  /**
   * 加载当前登陆用户
   */
  private _loadCurrentUser(): Observable<boolean> {
    return this.httpClient.get('v2/staff/_current').pipe(
      map((res: WebApiHttpResponse) => {
        this._currentUser = res.getModel();
        return true;
      }),
      catchError((e) => of(false))
    );
  }

  /**
   * 加载当前登陆用户的权限列表
   */
  private _loadPermissions(): Observable<boolean> {
    return this.httpClient.get('staffs/_current/permissions').pipe(
      map((res: WebApiHttpResponse) => {
        this._allPermissionMap = { students: ['GET'] };
        res.getCollection('staff_permissions', (o) => ({ method: o.method || 'GET', apiUrl: o.uri || '' })).forEach((permission) => {
          if (permission.apiUrl.length === 0) { return; }
          if (!this._allPermissionMap[permission.apiUrl]) {
            this._allPermissionMap[permission.apiUrl] = [];
          }
          this._allPermissionMap[permission.apiUrl].push(permission.method);
        });
        return true;
      }),
      catchError(() => of(false))
    );
  }

  /**
   * 判断是否具备接口的调用权限
   * @param apiUrl 待判断的 Api Url
   * @param method 调用方式
   */
  public can(apiUrl: string, method: RequestMethod = 'GET') {
    if (apiUrl.length === 0) { return false; }
    let i = 0;
    apiUrl = apiUrl.replace(/\{(\w+)\}/ig, () => `{${i++}}`);
    return this._allPermissionMap[apiUrl] && this._allPermissionMap[apiUrl].indexOf(method) >= 0;
  }

  /**
   * 加载最新的配置
   */
  public loadConfig(): Observable<boolean> {
    if (sessionStorage.getItem('builderReady') === 'true') {
      this.getSyncedSelectGroups().forEach((selectGroup) => this.selectGroups[selectGroup.name] = selectGroup.items);
      this._readySubject.next(true);
      return of(true);
    }

    const currentVersion = localStorage.getItem('builderVersion') || '';
    let latestVersion = '';
    return this.httpClient.get('enumerations/_version').pipe(
      map((res: NgxExcelHttpResponse) => {
        latestVersion = res.getModel<string>((o) => o.version || '');
        return currentVersion.length === 0 || currentVersion < latestVersion;
      }),
      mergeMap((isOlderVersion) => isOlderVersion ? this.syncSelectGroups() : of(true)),
      tap((success) => {
        if (!success) { return; }
        this.getSyncedSelectGroups().forEach((selectGroup) => this.selectGroups[selectGroup.name] = selectGroup.items);
        localStorage.setItem('builderVersion', latestVersion);
        sessionStorage.setItem('builderReady', 'true');
        this._readySubject.next(true);
      })
    );
  }

  /**
   * 获得资源准备订阅源
   */
  public getReadySubject(): Observable<boolean> {
    return this._readySubject as Observable<boolean>;
  }

  /**
   * 同步远程枚举
   */
  protected syncSelectGroups(): Observable<boolean> {
    return this.pullSelectGroups().pipe(
      map((selectGroups) => {
        const expiredTime = utc().add(30, 'days');
        localStorage.setItem(
          'syncedSelectGroups',
          JSON.stringify({ selectGroups, expiredTime: expiredTime.format('YYYY-MM-DD HH:mm:ss') })
        );
        return true;
      }),
      catchError(() => of(false))
    );
  }

  /**
   * 拉取远程枚举
   */
  protected pullSelectGroups(): Observable<Array<{ name: string, items: SelectOption[] }>> {
    return this.httpClient.get('enumerations').pipe(
      map((res: NgxExcelHttpResponse) =>
        res.getCollection<{ name: string, items: SelectOption[] }>('enumerations', (o) =>
          ({ name: o.name, items: this.flattenSelectOptions(o.items) })))
    );
  }

  /**
   * 获得已经同步的选项列表
   */
  protected getSyncedSelectGroups(): Array<{ name: string, items: SelectOption[] }> {
    const syncedSelectGroupsJson = localStorage.getItem('syncedSelectGroups') || '';
    if (!syncedSelectGroupsJson) {
      return [];
    }
    const syncedSelectGroups = JSON.parse(syncedSelectGroupsJson);
    return syncedSelectGroups.selectGroups || [];
  }

  /**
   * 根据 name 列表获得选项列表
   * @param name 枚举名列表
   */
  public getSelectGroups(name: string[]): Array<{ name: string, options: SelectOption[] }> {
    return lodash.map(
      lodash.filter(this.getSyncedSelectGroups(), (syncedSelectGroup) => lodash.indexOf(name, syncedSelectGroup.name) >= 0),
      (syncedSelectGroup) => {
        return { name: syncedSelectGroup.name, options: syncedSelectGroup.items };
      }
    );
  }

  /**
   * 平铺格式化服务器返回的所有枚举
   * @param o 服务器返回的枚举对象
   * @param prefix 枚举名前缀
   */
  protected flattenSelectOptions(o: Array<any>, prefix?: string): SelectOption[] {
    const selectOptions: SelectOption[] = [];
    lodash.each(o, (item) => {
      if (item.children) {
        selectOptions.push(...this.flattenSelectOptions(item.children, (prefix ? (prefix + '-') : '') + item.label));
      } else {
        selectOptions.push({
          label: item.label,
          value: lodash.isSafeInteger(item.value) ? item.value.toString() : item.value,
        });
      }
    });
    return selectOptions;
  }

  /**
   * 根据上传参数生成上传服务对象
   * @param payload 额外的上传参数
   */
  public getUploadService(payload: { [name: string]: string | Blob }): NgxExcelUploadService {
    const upload = (uploadXHRArgs: UploadXHRArgs) => {
      const uploadUrl = 'documents/_upload';
      const formData = new FormData();
      Object.keys(payload).forEach((payloadKey) => formData.append(payloadKey, payload[payloadKey]));
      formData.append('upload_files', uploadXHRArgs.file as any);
      const httpRequest = new HttpRequest('POST', uploadUrl, formData, { reportProgress: true, withCredentials: true });
      return this.httpClient.request(httpRequest).pipe(
        map((res: HttpEvent<{}>) => {
          if (!(res instanceof HttpResponse)) { return res; }
          const uploadFile = (res.body as WebApiHttpResponse).getModel<UploadFile>((o: any) => ({
            id: `${o.id}`,
            name: o.file_name || '',
            url: o.file_full_url || '',
            mimeType: o.mime_type || ''
          }));
          return res.clone({ body: uploadFile });
        })
      );
    };
    const remove = (file: AntUploadFile) => {
      const fileId = file.response ? (file.response as UploadFile).id : file.uid;
      return this.httpClient.delete(`documents/${fileId}`).pipe(
        map((res: WebApiHttpResponse) => res.getModel<UploadFile>((o: any) => ({
          id: `${o.id}`,
          name: o.file_name || '',
          url: o.file_full_url || '',
          mimeType: o.mime_type || ''
        })))
      );
    };
    const getThumbUrl = (file: UploadFile) => {
      if (file.mimeType && file.mimeType.toLowerCase().startsWith('image/')) {
        return file.url;
      }
      const pos = file.name.lastIndexOf('.');
      const extension = pos > 0 ? file.name.substr(pos).toLowerCase() : '';
      const fileIcons = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.mp3'];
      return fileIcons.indexOf(extension) >= 0 ?
        `/assets/icons/${extension}.png` : '';
    };

    const getPreviewUrl = (file: UploadFile) => file.url;
    const getDownloadUrl = (file: UploadFile) => file.url;
    return { upload, remove, getThumbUrl, getPreviewUrl, getDownloadUrl };
  }

  /**
   * 获得上传控件对象
   * @param options 上传配置
   */
  /* public getUploader(item: UploadXHRArgs): Observable<HttpEvent<UploadFile>> {
    const formData = new FormData();
    formData.append('upload_files', item.file as any);
    // formData.append('type', '1');
    const uploadUrl = 'documents/_upload';
    const req = new HttpRequest('POST', uploadUrl, formData, {
      reportProgress: true,
      withCredentials: true
    });
    return this.httpClient.request(req).pipe(
      map((res: HttpEvent<{}>) => {
        if (!(res instanceof HttpResponse)) {
          return res;
        }
        const uploadFile = (res.body as WebApiHttpResponse).getModel<UploadFile>((o: any) => ({
          id: `${o.id}`,
          name: o.file_name || '',
          url: o.file_url || '',
          mimeType: o.mime_type || ''
        }));
        return res.clone({ body: uploadFile });
      })
    );
  } */
  /*public getUploader(
    options: FileUploaderOptions,
    onSuccess?: (file: UploadFile) => any,
    onComplete?: () => any,
    onError?: (res: any) => any
  ): FileUploader {
      const uploader = new FileUploader(Object.assign({
          autoUpload: false,
          method: 'post',
          itemAlias: 'upload_files',
          disableMultipart: false,
          url: this.appConfig.gatewayUrl + '/documents/_upload'
      }, options));

      uploader.onSuccessItem = (_, response: string) => {
          if (onSuccess) {
              const responseJson = JSON.parse(response)['data'];
              const file: UploadFile = {
                name: responseJson.file_name || '',
                url: responseJson.file_url || '',
                mimeType: responseJson.mime_type || ''
              };
              onSuccess(file);
          }
      };

      uploader.onCompleteAll = () => {
          if (onComplete) {
              onComplete();
          } else {
              console.log('上传完成');
          }
      };

      uploader.onErrorItem = (_, response: string) => {
          if (onError) {
              onError(JSON.parse(response));
          } else {
              console.warn(JSON.parse(response));
          }
      };

      uploader.onCancelItem = () => {
          // console.log('cancel');
      };

      return uploader;
  }*/
}
