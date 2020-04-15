import { Directive, TemplateRef, Input } from '@angular/core';

@Directive({ selector: '[block]', })
export class LayoutBlockDirective {
  constructor(public template: TemplateRef<any>) { }
}
