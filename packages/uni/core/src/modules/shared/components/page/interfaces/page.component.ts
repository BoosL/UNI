import {
  OnInit,
  TemplateRef,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
  Type,
  Injector,
  ComponentFactoryResolver,
  InjectionToken
} from '@angular/core';
import { PageHeadDirective } from '../directives/page-head.directive';
import { PageHeadButtonsDirective } from '../directives/page-head-buttons.directive';
import { LayoutMainComponent } from '../components/layout-main.component';
import { LayoutSubComponent } from '../components/layout-sub.component';
import { pascalCase } from 'change-case';

export const BACKEND_PAGE = new InjectionToken<IBackendPageComponent>('BackendPageComponent');

export abstract class IBackendPageComponent implements OnInit {

  @ViewChild(LayoutMainComponent, { static: false }) layoutMainComponent: LayoutMainComponent;
  @ViewChildren(LayoutSubComponent) layoutSubComponents: QueryList<LayoutSubComponent>;
  @ViewChild(PageHeadDirective, { read: TemplateRef, static: false }) pageHeadTpl: TemplateRef<any>;
  @ViewChild(PageHeadButtonsDirective, { read: TemplateRef, static: false }) pageHeadButtonsTpl: TemplateRef<any>;

  constructor(
    protected renderer2: Renderer2,
    protected injector: Injector,
    protected cfr: ComponentFactoryResolver
  ) { }

  ngOnInit() { }

  handleMenuClick(layoutMenu: { name: string, active: boolean, component: Type<any> }) {
    if (!this.layoutMainComponent || layoutMenu.active) { return; }
    const factory = this.cfr.resolveComponentFactory(layoutMenu.component);
    const componentRef = factory.create(this.injector);

    const method = `create${pascalCase(layoutMenu.name)}Component`;
    const finalComponentRef = this[method] ? this[method](componentRef) : componentRef;
    this.layoutMainComponent.attachComponent(finalComponentRef);

    layoutMenu.active = true;
    this.layoutSubComponents.forEach((layoutSub) => layoutSub.detectChanges());
  }

}
