import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
  BackendService,
  EmployeeService
} from '@uni/core';
import {CustomerSourceStatelessService} from './customer-source-stateless.service';

@Injectable({ providedIn: 'root' })
export class CustomerSourceService extends CustomerSourceStatelessService {

  protected resourceUri = 'v2/customer/staff/_current/ccrn/sources';
  protected resourceName = 'sources';

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected employeeService: EmployeeService
  ) {
    super(httpClient, backendService);
  }

  /**
   * @inheritdoc
   * cacheKey = employeeId + '-' + schoolId + '-' + firstSourceId + ...
   */
  protected getPrefixCacheKey(filters?: { [name: string]: string | string[]; }) {
    const employee = this.employeeService.createModel(null, this.backendService.getCurrentUser());
    const employeeId = employee.id || '';
    const schoolId = filters.schoolId || '';
    const contactType = filters.contactType || '';
    const scene = filters.scene || '';
    if (!schoolId || !employeeId) {
      throw new Error('未知的校区和员工信息');
    }
    return `${employeeId}-${schoolId}-${contactType}-${scene}`;
  }

}
