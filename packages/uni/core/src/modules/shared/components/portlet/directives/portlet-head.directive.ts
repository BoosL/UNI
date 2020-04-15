import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[portletHead]' })
export class PortletHeadDirective {
  constructor(public template: TemplateRef<any>) { }
}
