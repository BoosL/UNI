export interface BaseStudent {
  id: string;
  sn: string;
  nameCn: string;
  nameEn: string;
  name: string;
}

// tslint:disable-next-line: no-empty-interface
export interface Student extends BaseStudent { }
