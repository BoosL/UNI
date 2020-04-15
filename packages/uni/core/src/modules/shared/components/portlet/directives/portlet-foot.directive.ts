import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[portletFoot]' })
export class PortletFootDirective {
  constructor(public template: TemplateRef<any>) { }
}
