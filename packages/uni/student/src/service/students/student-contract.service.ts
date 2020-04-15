import { Injectable } from '@angular/core';
import { ContractDtoService} from '@uni/contract';

@Injectable({providedIn: 'root'})
export class StudentContractService extends ContractDtoService {
  protected resourceUri = 'students/{student_id}/contracts';
  protected resourceName = 'student_contracts';
}
