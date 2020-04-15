import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[alertBarBody]' })
export class AlertBarBodyDirective {

    constructor(public template: TemplateRef<any>) { }

}
