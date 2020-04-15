import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatProgressSpinnerModule, MatButtonModule, MatRippleModule } from '@angular/material';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { WechatLoginService } from './services/wechat-login.service';
import { BackendPassportComponent } from './components/passport/passport.component';
import { BackendLoginPanelComponent } from './components/login/login.component';
import { BackendForgetPasswordPanelComponent } from './components/forget-password/forget-password.component';

@NgModule({
  declarations: [
    BackendPassportComponent,
    BackendLoginPanelComponent,
    BackendForgetPasswordPanelComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    NgZorroAntdModule
  ],
  exports: [
    BackendPassportComponent
  ],
  providers: [
    WechatLoginService
  ],
  entryComponents: [
    BackendLoginPanelComponent,
    BackendForgetPasswordPanelComponent
  ]
})
export class BackendPassportModule { }
