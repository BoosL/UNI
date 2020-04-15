import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[pageHead]' })
export class PageHeadDirective {
  constructor(public template: TemplateRef<any>) { }
}
