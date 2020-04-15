import { SelectOption, UploadFile } from '../../../models/models';
import { AvailableRestDate } from './available-rest-date.model';

export interface ConfirmedScheduleEditModel {
  id: string;
  originalDate: string;
  originalScheduleType: SelectOption;
  startDate: string;
  endDate: string;
  scheduleType: SelectOption;
  attachments: UploadFile[];
  restDates: AvailableRestDate[];
  remark: string;
}
