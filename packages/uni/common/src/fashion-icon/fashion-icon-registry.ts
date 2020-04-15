import { Injectable, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatIconRegistry } from '@angular/material/icon';
import { SVG_ICONS, SvgIconInfo } from './fashion-icon.model';
import { of } from 'rxjs';

interface SvgIconMap {
  [iconName: string]: SVGElement;
}

@Injectable()
export class FashionIconRegistry extends MatIconRegistry {

  protected preloadedSvgElements: SvgIconMap = {};

  constructor(http: HttpClient, sanitizer: DomSanitizer, @Inject(DOCUMENT) document: any, @Inject(SVG_ICONS) svgIcons: SvgIconInfo[]) {
    super(http, sanitizer, document);
    this.registerFontClassAlias('fontawesome', 'fa');
    this.registerFontClassAlias('lineawesome', 'la');
    this.loadSvgElements(svgIcons);
  }

  getNamedSvgIcon(iconName: string, namespace?: string) {
    if (this.preloadedSvgElements[iconName]) {
      return of(this.preloadedSvgElements[iconName].cloneNode(true) as SVGElement);
    }
    return super.getNamedSvgIcon(iconName, namespace);
  }

  protected loadSvgElements(svgIcons: SvgIconInfo[]) {
    const div = document.createElement('DIV');
    svgIcons.forEach(icon => {
      div.innerHTML = icon.svgSource;
      // tslint:disable-next-line:no-non-null-assertion
      this.preloadedSvgElements[icon.name] = div.querySelector('svg')!;
    });
  }
}
