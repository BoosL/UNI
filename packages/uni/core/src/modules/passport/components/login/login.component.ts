import { Component, OnInit, ChangeDetectionStrategy, Inject, Input, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { AuthService } from '@uni/common';
import { IBackendPassportPanelComponent, animationPassportPanel } from '../../interfaces/panel.component';
import { BACKEND_ROOT, BackendComponent } from '../../../../backend.component';
import { PasswordCredential } from '../../models/password-credential.model';
import { WechatLoginService } from '../../services/wechat-login.service';

@Component({
  selector: 'div.passport-panel.passport-panel--login',
  templateUrl: './login.component.html',
  animations: [animationPassportPanel]
})
export class BackendLoginPanelComponent extends IBackendPassportPanelComponent implements OnInit {

  loading = false;
  passwordMode = 'password';
  credential: FormGroup;
  wechatLoginUrl: string;

  @Input() backUrl: string;

  constructor(
    protected router: Router,
    protected cdr: ChangeDetectorRef,
    protected builder: FormBuilder,
    protected message: NzMessageService,
    protected authService: AuthService,
    protected wechatLoginService: WechatLoginService,
    @Inject(BACKEND_ROOT) backend: BackendComponent
  ) {
    super('系统登陆', backend);
  }

  ngOnInit() {
    super.ngOnInit();
    this.wechatLoginUrl = this.wechatLoginService.getLoginUrl();
    this.credential = this.builder.group({
      username: [
        this._getPreferentUsername(),
        [Validators.required, Validators.minLength(3), Validators.maxLength(18)]
      ],
      password: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(18)]
      ]
    });
  }

  /**
   * 切换密码显示模式
   */
  togglePasswordMode() {
    this.passwordMode = this.passwordMode === 'text' ? 'password' : 'text';
  }

  /**
   * 用户登陆
   * @param value 登陆凭证
   * @param valid 表单值验证结果
   */
  login({ value, valid }: { value: PasswordCredential, valid: boolean }) {
    if (!valid) {
      this.message.error('用户名或密码错误');
      return;
    }

    const payload = { identifier: value.username, credential: value.password };

    this.loading = true;
    this.authService.login(payload).subscribe(() => {
      this.loading = false;
      this._setPreferentUsername(value.username);
      this.router.navigate([this.backUrl]);
    }, () => {
      this.loading = false;
      // this.message.error(e.message || '系统错误，请联系管理员');
      this.message.error('用户名或密码错误');
      this.cdr.detectChanges();
    });
  }

  /**
   * 获得偏好的用户名
   */
  private _getPreferentUsername(): string {
    return localStorage.getItem('preferentUsername') || '';
  }

  /**
   * 设置偏好的用户名
   * @param username 用户名
   */
  private _setPreferentUsername(username: string) {
    if (!username) {
      localStorage.removeItem('preferentUsername');
    } else {
      localStorage.setItem('preferentUsername', username);
    }
  }

}
