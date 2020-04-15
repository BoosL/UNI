import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ComponentFactoryResolver,
  AfterViewInit,
  ViewChild,
  ViewContainerRef,
  Type,
  ComponentRef,
  OnDestroy
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IBackendPassportPanelComponent } from '../../interfaces/panel.component';
import { BackendLoginPanelComponent } from '../login/login.component';
import { BackendForgetPasswordPanelComponent } from '../forget-password/forget-password.component';

@Component({
  selector: 'backend-passport',
  templateUrl: './passport.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackendPassportComponent implements OnInit, AfterViewInit, OnDestroy {

  private _backUrl = '/';
  private _panelComponent: ComponentRef<IBackendPassportPanelComponent>;

  @ViewChild('container', { read: ViewContainerRef, static: false }) panelContainer: ViewContainerRef;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected cfr: ComponentFactoryResolver
  ) { }

  ngOnInit() {
    this._backUrl = this.activatedRoute.snapshot.queryParams.backUrl || '/';
  }

  ngOnDestroy() {
    if (this._panelComponent) {
      this._panelComponent.destroy();
    }
  }

  ngAfterViewInit() {
    this._createPanelComponent(BackendLoginPanelComponent, { backUrl: this._backUrl });
  }

  private _createPanelComponent(componentType: Type<IBackendPassportPanelComponent>, data?: { [name: string]: any }) {
    if (this._panelComponent) {
      this._panelComponent.destroy();
    }
    const factory = this.cfr.resolveComponentFactory(componentType);
    this._panelComponent = this.panelContainer.createComponent(factory) as ComponentRef<IBackendPassportPanelComponent>;
    Object.keys(data || {}).forEach((name) => {
      this._panelComponent.instance[name] = data[name];
    });
    this._panelComponent.instance.panelToggle.subscribe((event: { name: string, data?: any }) => {
      if (event.name === 'login') {
        this._createPanelComponent(BackendLoginPanelComponent, { backUrl: this._backUrl });
      } else if (event.name === 'forget-password') {
        this._createPanelComponent(BackendForgetPasswordPanelComponent);
      }/* else if (event.name === 'login-oauth') {
        if (event.data === undefined) {
          return;
        }
        this.createPanelComponent(LoginOauthComponent, event.data);
      }*/
    });
    this._panelComponent.changeDetectorRef.detectChanges();
  }

}
