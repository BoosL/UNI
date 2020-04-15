import { SelectOption } from '../../models/models';
import { School } from './school.model';

export interface BaseClassroom {
  id: string;
  name: string;
}

export interface Classroom extends BaseClassroom {
  frequencyName: string;
  capacityNum: number;
  roomSizeType: SelectOption;
  isSupportVideo: boolean;
  isStandard: boolean;
  originalPurpose: string;
  relativeSchool: School;
  status: SelectOption;
  remark: string;
}
