import { School, SelectOption } from '@uni/core';

export interface CustomerCompatibleFollowRecord {
  id: string;
  content: string;
  school: School;
  nextFollowTime: string;
  nextVisitedTime: string;
  endCode: SelectOption;
  status: SelectOption;
}
