import { OnInit, InjectionToken, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Platform } from '@angular/cdk/platform';
import { IBackendConfig, BACKEND_CONFIG } from './backend.config';

export const BACKEND_ROOT = new InjectionToken<BackendComponent>('BackendComponent');

export abstract class BackendComponent implements OnInit {

  public isMobileDevice = false;
  public deviceSupport = false;

  constructor(
    protected title: Title,
    protected platform: Platform,
    @Inject(BACKEND_CONFIG) protected appConfig: IBackendConfig
  ) { }

  ngOnInit() {
    this.setTitle();
    this.isMobileDevice = this.platform.ANDROID || this.platform.IOS;
    this.deviceSupport = this.isSupportedDevice();
  }

  /**
   * 设置页面标题
   * @param name 页面标题
   */
  public setTitle(name?: string | string[]) {
    const titlePrefix = name ? (Array.isArray(name) ? name.reverse().join('_') : name) : '';
    this.title.setTitle(titlePrefix + (titlePrefix.length > 0 ? '_' : '') + this.appConfig.name);
  }

  /**
   * 判断浏览器是否支持
   */
  protected isSupportedDevice() {
    if (this.platform.ANDROID || this.platform.IOS || this.platform.EDGE) {
      return true;
    }
    if (this.platform.WEBKIT || this.platform.BLINK) {
      const ua = navigator.userAgent.toLowerCase();
      const version = ua.match(/webkit\/([\d.]+)/);
      if (version && (version.length > 0 && parseFloat(version[1]) >= 537)) {
        const isChrome = ua.match(/chrome\/([\d.]+)/);
        if (isChrome) {
          return isChrome.length > 1 && parseFloat(isChrome[1]) >= 70;
        }
        return true;
      }
    }
    return false;
  }

}
