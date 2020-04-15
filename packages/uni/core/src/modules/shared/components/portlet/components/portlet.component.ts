import { Component, OnInit, ContentChild, TemplateRef, Input, HostBinding } from '@angular/core';
import { PortletHeadDirective } from '../directives/portlet-head.directive';
import { PortletBodyDirective } from '../directives/portlet-body.directive';
import { PortletFootDirective } from '../directives/portlet-foot.directive';

@Component({
  selector: 'portlet',
  templateUrl: './portlet.component.html'
})

export class PortletComponent implements OnInit {

  private _noPadding = false;
  private _noBorder = false;
  private _scrollableX = false;
  private _scrollableY = false;

  @Input() title: string;
  @Input() warning: string;
  @Input() subtitle: string;
  @Input() icon: string;
  @Input() actions: TemplateRef<any>[] = [];
  @Input()
  set scrollableX(value: boolean) { this._scrollableX = value === false ? false : true; }
  get scrollableX(): boolean { return this._scrollableX; }
  @Input()
  set scrollableY(value: boolean) { this._scrollableY = value === false ? false : true; }
  get scrollableY(): boolean { return this._scrollableY; }
  @Input()
  set noPadding(value: boolean) { this._noPadding = value === false ? false : true; }
  get noPadding(): boolean { return this._noPadding; }
  @Input()
  set noBorder(value: boolean) { this._noBorder = value === false ? false : true; }
  get noBorder(): boolean { return this._noBorder; }
  @Input()
  set dataTable(value: boolean) {
    if (value === false) { return; }
    this._noPadding = true;
    this._noBorder = true;
  }

  @HostBinding('class.scrollable-x') scrollableXClass = false;
  @HostBinding('class.scrollable-y') scrollableYClass = false;
  @ContentChild(PortletHeadDirective, { read: TemplateRef, static: false }) portletHeadTpl: TemplateRef<any>;
  @ContentChild(PortletBodyDirective, { read: TemplateRef, static: false }) portletBodyTpl: TemplateRef<any>;
  @ContentChild(PortletFootDirective, { read: TemplateRef, static: false }) portletFootTpl: TemplateRef<any>;

  constructor() { }

  ngOnInit() {
    this.scrollableXClass = this.scrollableX;
    this.scrollableYClass = this.scrollableY;
  }
}
