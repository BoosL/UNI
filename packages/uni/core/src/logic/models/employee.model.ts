import { SelectOption } from '../../models/select-option.model';
import { UploadFile } from '../../models/upload-file.model';
import { School } from './school.model';
import { OrganizationPosition } from './organization-position.model';

export interface BaseEmployee {
  id: string;
  sn: string;
  name: string;
  nameCn: string;
  nameEn: string;
}

export interface EmployeeRole {
  id: string;
  name: string;
  tags: string[];
}

export interface EmployeeOrganizationPosition extends OrganizationPosition {
  name: string;
  level: SelectOption;
  isMain: boolean;
}

export interface Employee extends BaseEmployee {
  loginName: string;
  portrait: UploadFile;
  qq: string;
  wechat: string;
  email: string;
  idCardNum: string;
  address: string;
  phoneNumber: string;
  officeNumber: string;
  backupPhoneNumber: string;
  isPluralistic: boolean;
  entryDate: string;
  departureDate: string;
  styles: SelectOption[];
  tags: SelectOption[];
  score: string;
  scoreCount: number;
  status: SelectOption;

  relativeSchools: School[];
  relativeOrganizationPosition: EmployeeOrganizationPosition[];

  school: School;
  organizationPosition: EmployeeOrganizationPosition;

  role: EmployeeRole[];

  /*roleIds: number[];

  fromCampusId: number;
  fromCampusName: string;
  mainPositionId: number;
  mainPositionName: string;
  mainOrganizationId: number;
  mainOrganizationName: string;
  mainOrganizationPositionId: number;
  mainOrganizationPositionName: string;
  positionLevel: number;

  ccAccept: number;
  tmkAccept: number;*/
}
