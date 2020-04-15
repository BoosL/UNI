import { SelectOption,
  CustomerSource,
  CustomerContactType,
  BaseCustomer,
  Employee,
  School
} from '@uni/core';

export interface MarketingCustomer extends BaseCustomer {
  gender: SelectOption;
  age: number;
  phone: string;
  phoneParents: string;
  phoneBackup: string;
  grade: SelectOption;
  capacity: SelectOption;
  learningPurpose: SelectOption;
  level: SelectOption;
  isImportant: boolean;
  isEffective: boolean;
  isStudent: boolean;

  cc: Employee;
  levelCc: SelectOption;
  sc: Employee;
  tmk: Employee;
  levelTmk: SelectOption;
  cd: Employee;
  relativeFirstSource: CustomerSource;
  relativeSecondSource: CustomerSource;
  relativeThirdSource: CustomerSource;
  relativeSource: string;
  relativeSourceEmployee: Employee;

  visitedCount: number;
  contactType: CustomerContactType;
  lastVisitedSchool: School;
  lastVisitedTime: string;
  nextFollowBeginTime: string;
  nextFollowEndTime: string;
  nextFollowTime: string;
  firstConsultingDuration: number;
  nextVisitedTime: string;
  isSourceProtected: boolean;
  sourceProtectedToDate: string;

  // lastAddedTime: string;

  recommendCurriculumType: SelectOption;
  recommendCurriculumCount: number;
  recommendCurriculumMonthCount: number;
  contractRate: number;
  hasDeposit: boolean;
  creator: Employee;
  createdTime: string;
  status: SelectOption;
  remark: string;
  remarkSource: string;
  visitType: SelectOption;
}

export interface MarketingCustomerVersion {
  id: string;
  grade: SelectOption;
  capacity: SelectOption;
  learningPurpose: SelectOption;

  cc: Employee;
  tmk: Employee;
  relativeFirstSource: CustomerSource;
  relativeSecondSource: CustomerSource;
  relativeThirdSource: CustomerSource;
  relativeSourceEmployee: Employee;

  contactType: CustomerContactType;

  relativeMarketingCustomer: MarketingCustomer;
  creator: Employee;
  createdTime: string;
}

export interface MarketingCustomerCcrn {
  id: string;
  depositConfig: string;
  nextStepConfig: string;
}
