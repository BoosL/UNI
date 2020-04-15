import { Component, Inject, OnInit } from '@angular/core';
import { IBackendPassportPanelComponent, animationPassportPanel } from '../../interfaces/panel.component';
import { BACKEND_ROOT, BackendComponent } from '../../../../backend.component';

@Component({
  selector: 'div.passport-panel.passport-panel--forget-password',
  templateUrl: './forget-password.component.html',
  animations: [animationPassportPanel]
})
export class BackendForgetPasswordPanelComponent extends IBackendPassportPanelComponent implements OnInit {

  constructor(
    @Inject(BACKEND_ROOT) backend: BackendComponent
  ) {
    super('找回密码', backend);
  }

  ngOnInit() { }

}
