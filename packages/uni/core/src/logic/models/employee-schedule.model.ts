import { SelectOption, UploadFile } from '../../models/models';

export interface EmployeeSchedule {
  id: string;
  date: string;
  type: SelectOption;
  auditType: SelectOption;
  attachments: UploadFile[];
  status: SelectOption;
  remark: string;
}
