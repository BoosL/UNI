import { School } from '@uni/core';

export interface SchoolRestTime {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  relativeSchool: School;
  createdTime: string;
}
