import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelModelColumnRules } from 'ngx-excel';
import {
  SelectOption,
  School,
  Student,
  Product,
  ProductSubject,
  BaseService,
  BackendService,
  BaseProductService,
  BaseProductSubjectService,
  BankService,
  BankInstalmentService,
} from '@uni/core';
import { CartRequestParam, CartType, CartEntity, CartEntityTimeSectionConfig, CartDiscount } from '../models/cart.model';
import { CartEntityService } from './cart-entity.service';
import { CartDiscountService } from './cart-discount.service';
import { CartBillService } from './cart-bill.service';
import { CartContractService } from './cart-contract.service';
import { throwError, Observable, of, forkJoin, BehaviorSubject } from 'rxjs';
import { map, mergeMap, filter, distinctUntilChanged, tap } from 'rxjs/operators';

@Injectable()
export class CartService extends BaseService<never> {

  protected resourceUri = 'students/{student_id}/carts';
  protected resourceName = 'carts';
  protected rules = {} as NgxExcelModelColumnRules<never>;

  protected currentSchool: School;
  protected currentStudent: Student;
  protected currentCartType: SelectOption;

  protected entityService: CartEntityService;
  protected discountService: CartDiscountService;
  protected billService: CartBillService;
  protected contractService: CartContractService;

  protected discountChangeSubject = new BehaviorSubject<CartDiscount[]>([]);

  protected entitiesInCart: CartEntity[] = [];

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected bankService: BankService,
    protected instalmentService: BankInstalmentService,
    protected productService: BaseProductService<Product>,
    protected subjectService: BaseProductSubjectService<ProductSubject>,
  ) {
    super(httpClient, backendService);
  }

  /**
   * 为当前学员和当前操作分配新的购物车
   * @param currentStudent 当前学员主键
   * @param currentCartType 当前操作
   */
  public initial(currentSchool: School, currentStudent: Student, currentCartType: SelectOption): Observable<CartService> {
    this.currentSchool = currentSchool;
    this.currentStudent = currentStudent;
    this.currentCartType = currentCartType;
    this.entityService = null;
    return this.clearCart().pipe(
      mergeMap(() => {
        const initialStreams = [];
        initialStreams.push(this.getEntityService().initial(this.currentSchool, this.currentStudent, this.currentCartType));
        return forkJoin(initialStreams);
      }),
      map((x) => {
        console.log(x);
        return this;
      }),
    );
  }

  /**
   * 清除购物车
   */
  public clearCart(): Observable<void> {
    if (!this.currentSchool || !this.currentStudent || !this.currentCartType) {
      return throwError(new Error('购物车未绑定校区、学员或操作类型'));
    }
    return this.destroy('_current', { studentId: this.currentStudent.id, contractType: this.currentCartType.value }).pipe(
      map(() => null)
    );
  }

  /**
   * 获得操作类型的枚举
   * @param type 操作类型代号
   */
  public getCartType(type: CartType): SelectOption {
    let cartType: SelectOption;
    switch (type) {
      case 'new-purchase':
        cartType = this.getContractService().getNewPurchaseContractType();
        break;
      case 'continuous-purchase':
        cartType = this.getContractService().getContinuousPurchaseContractType();
        break;
      case 'swap':
        cartType = this.getContractService().getSwapContractType();
        break;
      case 'etp-exchange':
      case 'non-etp-exchange':
        cartType = this.getContractService().getExchangeContractType();
        break;
      case 'etp-translation':
        cartType = this.getContractService().getTranslationContractType();
        break;
    }
    return cartType;
  }

  /**
   * 获得当前校区
   */
  public getCurrentSchool(): School {
    return this.currentSchool;
  }

  /**
   * 获得当前学员
   */
  public getCurrentStudent(): Student {
    return this.currentStudent;
  }

  /**
   * 获得当前操作类型
   */
  public getCurrentCartType(): SelectOption {
    return this.currentCartType;
  }

  /**
   * 获得可用的产品类型列表
   */
  public getAvailableProductTypes(): SelectOption[] {
    return this.getEntityService().getAvailableProductTypes();
  }

  /**
   * 获得购物车产品的学习时长配置
   */
  public getTimeSectionConfigsInCart(): CartEntityTimeSectionConfig[] {
    return this.getEntityService().getTimeSectionConfigs();
  }

  /**
   * 获得课时操作模式枚举
   */
  public getCurriculumCountMode(): SelectOption {
    return this.getEntityService().getCurriculumCountMode();
  }

  /**
   * 获得课号操作模式枚举
   */
  public getCurriculumNoMode(): SelectOption {
    return this.getEntityService().getCurriculumNoMode();
  }

  /**
   * 判断指定的产品类型是否是 ETP 类产品类型
   */
  public isEtpProductType(productType: SelectOption): boolean {
    const productTypes = this.productService.getEtpProductTypes();
    return productTypes.some((p) => p.value === productType.value);
  }

  /**
   * 获得购物车中的实体
   */
  public getEntitiesInCart(): CartEntity[] {
    return this.entitiesInCart;
  }

  /**
   * 购物车增加退课项
   * @param requestParam 请求参数
   * @param discountQuiet 是否忽略折扣刷新
   */
  public refundToCart(requestParam: CartRequestParam, discountQuiet = false) {
    return this.getEntityService().batchSave(requestParam).pipe(
      tap(() => {
        if (discountQuiet) { return; }
        this.getDiscountService().getList({
          studentId: this.currentStudent.id, cartId: '_current', contractType: this.currentCartType.value
        }).subscribe((discounts) => this.discountChangeSubject.next(discounts));
      })
    );
  }

  /**
   * 恢复购物车退课项
   * @param requestParam 请求参数
   * @param discountQuiet 是否忽略折扣刷新
   */
  public restoreFromCart(requestParam: CartRequestParam, discountQuiet = false) {
    return of(null);
  }

  /**
   * 购物车增加采购项
   * @param requestParam 请求参数
   * @param discountQuiet 是否忽略折扣刷新
   */
  public addToCart(requestParam: CartRequestParam, discountQuiet = false) {
    return this.getEntityService().batchSave(requestParam).pipe(
      tap(() => {
        if (discountQuiet) { return; }
        this.getDiscountService().getList({
          studentId: this.currentStudent.id, cartId: '_current', contractType: this.currentCartType.value
        }).subscribe((discounts) => this.discountChangeSubject.next(discounts));
      })
    );
  }

  /**
   * 从购物车移除采购项
   * @param requestParam 请求参数
   * @param discountQuiet 是否忽略折扣刷新
   */
  public removeFromCart(requestParam: CartRequestParam, discountQuiet = false) {
    return of(null);
  }

  /**
   * 检测指定事件的发生
   */
  public watch(
    name: 'discountChange' | 'totalChange' | 'refundMoneyChange' | 'instalmentFeeChange',
    productType: SelectOption
  ): Observable<any> {
    if (name === 'discountChange') {
      const exceptIds = [
        this.getDiscountService().getTotalItemId(),
        this.getDiscountService().getRefundMoneyItemId(),
        this.getDiscountService().getInstalmentFeeItemId()
      ];
      return this.discountChangeSubject.asObservable().pipe(
        map((discounts) => {
          const filteredDiscounts = discounts.filter((discount) => {
            return discount.allowProductTypes.some((allowProductType) => allowProductType.value === productType.value) &&
              (discount.productType.value === productType.value) && (exceptIds.indexOf(discount.id) < 0);
          });
          return filteredDiscounts;
        })
      );
    }

    let discountId: string;
    if (name === 'totalChange') {
      discountId = this.getDiscountService().getTotalItemId();
    } else if (name === 'refundMoneyChange') {
      discountId = this.getDiscountService().getRefundMoneyItemId();
    } else if (name === 'instalmentFeeChange') {
      discountId = this.getDiscountService().getInstalmentFeeItemId();
    }

    return (this.discountChangeSubject.asObservable()).pipe(
      map((discounts) => discounts.find((discount) => discount.id === discountId && discount.productType.value === productType.value)),
      distinctUntilChanged((o1, o2) => o1.value === o2.value),
      map((discount) => discount.value)
    );
  }

  /**
   * 获得购物车账单列表
   */
  public getBills() {
    return this.getBillService().getList({
      studentId: this.currentStudent.id, cartId: '_current', contactType: this.currentCartType.value
    });
  }

  /**
   * 创建购物车合同并返回
   */
  public createContracts() {
    return this.getContractService().batchSave({
      studentId: this.currentStudent.id, cartId: '_current', contactType: this.currentCartType.value
    });
  }

  /**
   * 获得购物车实体服务
   */
  public getEntityService(): CartEntityService {
    if (!this.entityService) {
      this.entityService = new CartEntityService(this.httpClient, this.backendService, this.productService, this.subjectService);
    }
    return this.entityService;
  }

  /**
   * 获得折扣与价格相关服务
   */
  public getDiscountService(): CartDiscountService {
    if (!this.discountService) {
      this.discountService = new CartDiscountService(this.httpClient, this.backendService, this.productService);
    }
    return this.discountService;
  }

  /**
   * 获得购物车账单服务
   */
  public getBillService(): CartBillService {
    if (!this.billService) {
      this.billService = new CartBillService(this.httpClient, this.backendService, this.bankService, this.instalmentService);
    }
    return this.billService;
  }

  /**
   * 获得购物车合同服务
   */
  public getContractService(): CartContractService {
    if (!this.contractService) {
      this.contractService = new CartContractService(this.httpClient, this.backendService);
    }
    return this.contractService;
  }

}
