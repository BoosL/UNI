import { Injectable } from '@angular/core';
import { BaseEmployeeService } from '@uni/core';
import {ContractEmployee} from '../models/contract-employee.model';

@Injectable({providedIn: 'root'})
export class ContractEmployeeService extends BaseEmployeeService<ContractEmployee> {

    protected resourceUri = 'finance/available_staffs';
    protected resourceName = 'available_staffs';

}
