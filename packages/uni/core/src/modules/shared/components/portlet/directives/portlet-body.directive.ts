import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[portletBody]' })
export class PortletBodyDirective {
  constructor(public template: TemplateRef<any>) { }
}
