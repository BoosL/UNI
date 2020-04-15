import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input } from '@angular/core';
import { NgxExcelModelColumnRules } from 'ngx-excel';
import { SelectOption } from '@uni/core';
import { CartService } from '../../../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'curriculum-block-extra-discount',
  templateUrl: './1.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurriculumBlockExtraDiscountComponent implements OnInit, OnDestroy {

  context = null;
  canEditPresentedCurriculumCount = false;
  rules: NgxExcelModelColumnRules<any>;

  // tslint:disable-next-line: variable-name
  private _componentSubscription = new Subscription();

  @Input() productType: SelectOption;

  constructor(
    protected cartService: CartService
  ) { }

  ngOnInit() {
    const discountChangeSubscription = this.cartService.watch('discountChange', this.productType).subscribe((discounts) => {
      if (discounts.length === 0) { return; }
      console.log(discounts);
    });
    this._componentSubscription.add(discountChangeSubscription);
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  handleContextChange(e) { }

}
