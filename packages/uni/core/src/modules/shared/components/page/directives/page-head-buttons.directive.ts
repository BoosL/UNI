import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[pageHeadButtons]' })
export class PageHeadButtonsDirective {
  constructor(public template: TemplateRef<any>) { }
}
