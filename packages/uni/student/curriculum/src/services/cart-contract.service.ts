import { BaseContractService } from '@uni/core';
import { CartContract } from '../models/cart.model';

export class CartContractService extends BaseContractService<CartContract> {

  protected resourceUri = 'students/{student_id}/carts/{cart_id}/contracts';
  protected resourceName = 'contracts';

}
