import { Menu } from './menu.model';

export interface MenuGroup {
  label: string;
  children?: Menu[];
}
