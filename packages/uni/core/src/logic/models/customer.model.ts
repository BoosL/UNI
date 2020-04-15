import { School } from './school.model';

export interface BaseCustomer {
  id: string;
  name: string;
  nameCn: string;
  nameEn: string;
  school: School;
}

export interface Customer extends BaseCustomer {

}
