import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, OnDestroy, Input, Type, ComponentRef } from '@angular/core';
import { SchoolAvailableProductService, SchoolAvailableSubjectService, SelectOption } from '@uni/core';
import { CurriculumTableDataService, CurriculumTableComponent } from '@uni/curriculum';
import { CartEntity } from '../../../models/cart.model';
import { CartService } from '../../../services/cart.service';
import { CurriculumBlockComponent } from '../curriculum-block-component';
import { CurriculumBlockPurchaseNode } from './curriculum-block-purchase.model';
import { CurriculumBlockPurchaseTableDataService } from './curriculum-block-purchase-table-data.service';
import { Subscription, BehaviorSubject } from 'rxjs';

interface CurriculumBlockPanel extends CurriculumBlockPurchaseNode {
  disabled: boolean;
  loading: boolean;
  active: boolean;            // 是否选购该产品类型
  isEtpProductType: boolean;
  nzActive: boolean;          // 面板是否展开
  entities$: BehaviorSubject<CartEntity[]>;
  component: CurriculumTableComponent<CartEntity>;
}

export function factoryCurriculumTableDataService(
  cartService: CartService,
  productService: SchoolAvailableProductService,
  subjectService: SchoolAvailableSubjectService
) {
  return new CurriculumBlockPurchaseTableDataService(cartService, productService, subjectService);
}

@Component({
  selector: 'curriculum-block-purchase.curriculum-block',
  templateUrl: './curriculum-block-purchase.component.html',
  providers: [
    {
      provide: CurriculumTableDataService,
      useFactory: factoryCurriculumTableDataService,
      deps: [ CartService, SchoolAvailableProductService, SchoolAvailableSubjectService ]
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurriculumBlockPurchaseComponent extends CurriculumBlockComponent implements OnInit, OnDestroy, AfterViewInit {

  panels: CurriculumBlockPanel[];

  protected componentSubscription = new Subscription();

  ngOnInit() {
    this.sendComponentReady(false);
  }

  ngOnDestroy() {
    this.componentSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    const entities = this.cartService.getEntitiesInCart();
    this.panels = this.cartService.getAvailableProductTypes().map((productType) => {
      const panel = {} as CurriculumBlockPanel;
      const matchedEntities = entities.filter((entity) => entity.relativeProduct.type.value === productType.value && !entity.isRefund);
      panel.productType = Object.assign({}, productType);
      panel.disabled = false;
      panel.loading = false;
      panel.isEtpProductType = this.cartService.isEtpProductType(productType);
      panel.active = matchedEntities.length > 0;
      panel.nzActive = false;
      panel.entities$ = new BehaviorSubject<CartEntity[]>(matchedEntities);
      panel.component = null;
      return panel;
    });
    // 第一个有数据的面板默认展开
    const activedPanels = this.panels.filter((panel) => panel.active);
    if (activedPanels.length > 0) {
      activedPanels.forEach((panel) => panel.nzActive = false);
      activedPanels[0].nzActive = true;
    }
    this.cdr.detectChanges();
    this.sendComponentReady(true);
  }

  /**
   * 当添加 / 删除按钮被点击时执行
   * @param e 事件
   * @param currentPanel 当前面板配置
   */
  handleProductTypeButtonClick(e: Event, currentPanel: CurriculumBlockPanel) {
    e.stopPropagation();
    e.preventDefault();
    if (currentPanel.loading || currentPanel.disabled) { return; }
    if (currentPanel.active) {
      console.log('remove', currentPanel);
      currentPanel.loading = true;
      this.cdr.detectChanges();
      setTimeout(() => {
        if (currentPanel.isEtpProductType) {
          // ETP 互斥
          this.panels
            .filter((panel) => panel.isEtpProductType && panel.productType.value !== currentPanel.productType.value)
            .forEach((panel) => panel.disabled = false);
        }
        currentPanel.active = false;
        currentPanel.nzActive = false;
        currentPanel.loading = false;
        this.cdr.detectChanges();
      }, 3000);
    } else {
      if (currentPanel.isEtpProductType) {
        // ETP 互斥
        this.panels
          .filter((panel) => panel.isEtpProductType && panel.productType.value !== currentPanel.productType.value)
          .forEach((panel) => panel.disabled = true);
      }
      currentPanel.active = true;
      this.panels.forEach((panel) => panel.nzActive = false);
      currentPanel.nzActive = true;
      this.cdr.detectChanges();
    }
  }

  /**
   * 当产品类型被点击时执行
   */
  handleProductTypeClick(e: Event, currentPanel: CurriculumBlockPanel) {
    e.stopPropagation();
    e.preventDefault();
    if (currentPanel.active && !currentPanel.loading && !currentPanel.disabled) { return; }
    this.panels.forEach((panel) => panel.nzActive = false);
    currentPanel.nzActive = true;
    this.cdr.detectChanges();
  }

  /**
   * 当表格组件已完成页面渲染时执行
   */
  handleCurriculumTableReady(component: CurriculumTableComponent<CartEntity>, productType: SelectOption) {
    const panel = this.panels.find((p) => p.productType.value === productType.value);
    if (!panel) { return; }
    panel.component = component;
  }

  /**
   * 当表单组件被提交时执行
   */
  handleCurriculumFormSubmit(entities: CartEntity[], productType: SelectOption) {
    const panel = this.panels.find((p) => p.productType.value === productType.value);
    if (!panel) { return; }
    panel.entities$.next(
      entities.filter((entity) => entity.relativeProduct.type.value === productType.value && !entity.isRefund)
    );
  }

}
