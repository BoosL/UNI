import {School} from '@uni/core';

export interface BaseCustomer {
  id: string;
  nameCn: string;
  nameEn: string;
  name: string;
  school: School;
}
