import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelModelColumnRules, NgxExcelColumnType } from 'ngx-excel';
import { BaseEmployee, EmployeeRole, EmployeeOrganizationPosition, Employee } from '../../models/employee.model';
import { BaseService } from '../../../services/base.service';
import { BackendService } from '../../../services/backend.service';
import { SelectOption } from '../../../models/models';
import { SchoolService } from '../school.service';
import { School } from '../../models/school.model';
import { Enums } from '../../enums';
import { OrganizationService, PositionService } from '../organization-position.service';
import { isArray } from 'util';

export abstract class BaseEmployeeService<T extends BaseEmployee> extends BaseService<T> {

  protected rules = {
    id: {
      label: '员工主键', columnType: NgxExcelColumnType.PrimaryKey, prop: 'staff_id'
    },
    sn: {
      label: '员工工号', columnType: NgxExcelColumnType.Text, prop: 'work_num'
    },
    nameCn: {
      label: '中文名', columnType: NgxExcelColumnType.Text, prop: 'chinese_name'
    },
    nameEn: {
      label: '英文名', columnType: NgxExcelColumnType.Text, prop: 'english_name'
    },
    name: {
      label: '名称', columnType: NgxExcelColumnType.Text,
      resolveValue: (o: any) => this.resolveName(o)
    }
  } as NgxExcelModelColumnRules<T>;

  protected resolveName(o: any) {
    if (o.chinese_name && o.english_name) {
      return `${o.chinese_name} (${o.english_name})`;
    }
    return o.chinese_name ? o.chinese_name : o.english_name || '';
  }

}

@Injectable()
export class EmployeeRoleService extends BaseService<EmployeeRole> {

  protected resourceUri = '';
  protected resourceName = '';

  protected rules = {
    id: {
      label: '员工角色主键', columnType: NgxExcelColumnType.PrimaryKey, prop: 'role_id'
    },
    name: {
      label: '员工角色名称', columnType: NgxExcelColumnType.Text, prop: 'role_name'
    },
    tags: {
      label: '角色标签', columnType: NgxExcelColumnType.Array, prop: 'role_tags'
    }
  } as NgxExcelModelColumnRules<EmployeeRole>;

}

@Injectable()
export class EmployeeOrganizationPositionService extends BaseService<EmployeeOrganizationPosition> {

  protected resourceUri = '';
  protected resourceName = '';

  protected rules = {
    id: {
      label: '员工组织职位主键', columnType: NgxExcelColumnType.PrimaryKey, prop: 'organization_position_id'
    },
    organization: {
      label: '员工组织', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.organizationService, labelKey: 'name'
    },
    position: {
      label: '员工职位', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.positionService, labelKey: 'name'
    },
    name: {
      label: '组织职位名称', columnType: NgxExcelColumnType.Text,
      resolveValue: (_, model) => this.resolveName(model)
    },
    level: {
      label: '职称等级', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getPositionLevels(), prop: 'position_level'
    },
    isMain: {
      label: '是否主职位？', columnType: NgxExcelColumnType.Bool
    }
  } as NgxExcelModelColumnRules<EmployeeOrganizationPosition>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected organizationService: OrganizationService,
    protected positionService: PositionService
  ) {
    super(httpClient, backendService);
  }

  protected resolveName(model: Partial<EmployeeOrganizationPosition>) {
    return model.organization && model.position ? `${model.organization.nameShort} / ${model.position.name}` : '';
  }

  /**
   * 获得所有职级可选项
   */
  public getPositionLevels(): SelectOption[] {
    return this.getSelectOptions(Enums.OrganizationPosition.Level);
  }

}

@Injectable()
export class EmployeeService extends BaseEmployeeService<Employee> {

  protected resourceUri = 'v2/staff';
  protected resourceName = 'staff';

  protected additionalRules = {
    loginName: {
      label: '登录名',
      columnType: NgxExcelColumnType.Text
    },
    portrait: {
      label: '头像',
      columnType: NgxExcelColumnType.UploadFile,
      prop: 'avatar'
    },
    qq: {
      label: 'QQ号码',
      columnType: NgxExcelColumnType.Text
    },
    wechat: {
      label: '绑定微信',
      columnType: NgxExcelColumnType.Text
    },
    email: {
      label: 'Email',
      columnType: NgxExcelColumnType.Text
    },
    idCardNum: {
      label: '身份证',
      columnType: NgxExcelColumnType.Text,
      prop: 'id_number'
    },
    address: {
      label: '联系地址',
      columnType: NgxExcelColumnType.Text
    },
    phoneNumber: {
      label: '联系电话',
      columnType: NgxExcelColumnType.Text
    },
    officeNumber: {
      label: '办公电话',
      columnType: NgxExcelColumnType.Text
    },
    backupPhoneNumber: {
      label: '备用电话',
      columnType: NgxExcelColumnType.Text
    },
    isPluralistic: {
      label: '是否兼职',
      columnType: NgxExcelColumnType.Bool
    },
    entryDate: {
      label: '入职日期',
      columnType: NgxExcelColumnType.Date
    },
    departureDate: {
      label: '离职日期',
      columnType: NgxExcelColumnType.Date,
      optional: true
    },
    styles: {
      label: '教学风格',
      columnType: NgxExcelColumnType.MultiSelectOption,
      selectOptions: this.getSelectOptions(Enums.Employee.Style)
    },
    tags: {
      label: '员工标签',
      columnType: NgxExcelColumnType.MultiSelectOption,
      selectOptions: this.getSelectOptions(Enums.Employee.Tag)
    },
    score: {
      label: '得分小计',
      columnType: NgxExcelColumnType.Text
    },
    scoreCount: {
      label: '评分次数',
      columnType: NgxExcelColumnType.Number,
      optional: true
    },
    status: {
      label: '当前状态',
      columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Employee.Status)
    },
    relativeOrganizationPosition: {
      label: '关联组织职位',
      columnType: NgxExcelColumnType.MultiForeignKey,
      relativeService: this.employeeOPService,
      labelKey: 'name',
      resolveValue: (o: any) => this.resolveRelativeOrganizationPosition(o)
    },
    relativeSchools: {
      label: '关联校区',
      columnType: NgxExcelColumnType.MultiForeignKey,
      relativeService: this.schoolService,
      labelKey: 'name',
      prop: 'campus'
    },
    organizationPosition: {
      label: '组织职位',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.employeeOPService,
      labelKey: 'name',
      resolveValue: (_: any, model: Partial<Employee>) => this.resolveOrganizationPosition(model)
    },
    school: {
      label: '所属校区',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.schoolService,
      labelKey: 'name',
      resolveValue: (_: any, model: Partial<Employee>) => this.resolveSchool(model)
    },
    role: {
      label: '关联角色',
      columnType: NgxExcelColumnType.MultiForeignKey, labelKey: 'name',
      relativeService: this.employeeRoleService
    },
  };

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected schoolService: SchoolService,
    protected employeeRoleService: EmployeeRoleService,
    protected employeeOPService: EmployeeOrganizationPositionService
  ) {
    super(httpClient, backendService);
  }

  protected resolveRoleIds(o: any): number[] {
    return Object.keys(o).indexOf('role_id') >= 0 ?
      (Array.from(o.role_id) as string[]).map((roleId) => parseInt(roleId, 10)) : [];
  }

  protected resolveRelativeOrganizationPosition(o: any): EmployeeOrganizationPosition[] {
    const eOPs = o.organization_position || [];
    if (!isArray(eOPs)) { return []; }
    return eOPs.map((eOP) => this.employeeOPService.createModel(null, Object.assign({}, eOP, { organization: eOP, position: eOP })));
  }

  protected resolveOrganizationPosition(model: Partial<Employee>): EmployeeOrganizationPosition {
    return model.relativeOrganizationPosition.find((relativeOP) => relativeOP.isMain);
  }

  protected resolveSchool(model: Partial<Employee>): School {
    if (!model.organizationPosition) { return null; }
    const idParts = model.organizationPosition.organization.idPath.split('//').filter((idPart) => idPart.length > 0).reverse();
    let school = null;
    idParts.forEach((idPart) => {
      if (school) { return; }
      school = model.relativeSchools.find((relativeSchool) => relativeSchool.relativeOrganizationId === idPart);
    });
    return school;
  }

  protected resolveOrganizationTagIds(o: any): number[] {
    return Object.keys(o).indexOf('organization_tag_id') >= 0 ?
      (Array.from(o.organization_tag_id) as string[]).map((id) => parseInt(id, 10)) : [];
  }

  /**
   * 获得所有职级可选项
   */
  public getPositionLevels(): SelectOption[] {
    return this.employeeOPService.getPositionLevels();
  }

  /**
   * 判断员工是否是一个老师
   * @param model 待判断员工
   */
  public isTeacherRole(model: Employee) {
    return !!model.role.find((role) => role.id === '19' || role.id === '20' || role.id === '26');
  }

  /**
   * 判断员工是否是一个渠道人员
   * @param model 待判断员工
   */
  public isSourceRole(model: Employee) {
    return model.role.some((role) => role.tags.indexOf('SOURCE') >= 0);
  }

  /**
   * 判断员工是否是一个CC
   * @param model 待判断员工
   */
  public isCcRole(model: Employee) {
    return model.role.some((role) => role.tags.indexOf('CC') >= 0);
  }

  /**
   * 判断员工是否是一个前台
   * @param model 待判断员工
   */
  public isUsherRole(model: Employee) {
    return model.role.some((role) => role.tags.indexOf('USHER') >= 0);
  }

  /**
   * 判断员工是否是一个TMK
   * @param model 待判断员工
   */
  public isTmkRole(model: Employee) {
    return model.role.some((role) => role.tags.indexOf('TMK') >= 0);
  }

  /**
   * 判断员工是否是一个EA
   * @param model 待判断员工
   */
  public isEaRole(model: Employee) {
    return model.role.some((role) => role.tags.indexOf('EA') >= 0);
  }

}
