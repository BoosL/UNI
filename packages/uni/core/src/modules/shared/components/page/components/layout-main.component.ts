import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  TemplateRef,
  QueryList,
  ContentChildren,
  Input,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { LayoutBlockDirective } from '../directives/layout-block.directive';

@Component({
  selector: 'div.layout-main',
  template: `
    <ng-container *ngIf="blockTpls.length > 0">
      <div class="block"
        [class.full]="!canExternal && blockTpls.length === 1"
        [class.match-parent]="!canExternal && last"
        *ngFor="let blockTpl of blockTpls; let last = last;"
      ><ng-template [ngTemplateOutlet]="blockTpl"></ng-template></div>
      <div class="block match-parent" *ngIf="canExternal">
        <ng-container #externalContainer></ng-container>
      </div>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutMainComponent implements OnInit, OnDestroy {

  private _canExternal = false;
  private _externalComponent: ComponentRef<any> = null;

  @Input()
  set canExternal(value: boolean) { this._canExternal = value === false ? false : true; }
  get canExternal(): boolean { return this._canExternal; }
  @ViewChild('externalContainer', { read: ViewContainerRef, static: false }) container: ViewContainerRef;
  @ContentChildren(LayoutBlockDirective, { read: TemplateRef, descendants: true }) blockTpls: QueryList<TemplateRef<any>>;

  constructor(
    protected cdr: ChangeDetectorRef
  ) { }

  ngOnInit() { }

  ngOnDestroy() {
    if (this._externalComponent) {
      this._externalComponent.destroy();
    }
  }

  /**
   * 附加组件
   * @param component 待渲染的组件
   */
  attachComponent(component: ComponentRef<any>) {
    if (!this.container) { return; }
    if (this._externalComponent) {
      this.container.remove();
      this._externalComponent.destroy();
    }
    this.container.insert(component.hostView);
    this._externalComponent = component;
    this.cdr.detectChanges();
  }

}
