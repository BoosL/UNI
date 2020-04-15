import { Component, forwardRef } from '@angular/core';
import { BACKEND_ROOT, BackendComponent } from '@uni/core';

@Component({
  selector: 'backend',
  template: `<router-outlet></router-outlet>
  <ng-container *ngIf="!deviceSupport">
    <div class="device_notable">
      <div>
        <span>请使用69.0以上版本Chrome浏览器访问</span>
        <a class="download_btn" href="https://asset.baffedu.com/download/ChromeSetup.exe" download="" >下载
          Chrome   <img class="chrome_logo" src="assets/img/chrome-logo.svg"/> </a>
      </div>
    </div>
  </ng-container>`,
  providers: [
    { provide: BACKEND_ROOT, useExisting: forwardRef(() => AppComponent) }
  ]
})
export class AppComponent extends BackendComponent { }
