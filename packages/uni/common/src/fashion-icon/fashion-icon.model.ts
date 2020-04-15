import { InjectionToken } from '@angular/core';

export interface SvgIconInfo {
  name: string;
  svgSource: string;
}

export const SVG_ICONS = new InjectionToken<SvgIconInfo[]>('SvgIcons');
