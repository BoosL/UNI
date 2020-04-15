import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelModelColumnRules, NgxExcelColumnType, NgxExcelDataService } from 'ngx-excel';
import {
  School,
  Student,
  StudentBoughtProduct,
  StudentBoughtSubject,
  StudentBoughtCurriculum,
  BackendService,
  BankService,
  BankInstalmentService,
  StudentBoughtProductService,
  StudentBoughtSubjectService,
  StudentBoughtCurriculumService,
  SchoolAvailableProductService,
  SchoolAvailableSubjectService,
  SchoolAvailableCurriculumService
} from '@uni/core';
import { CartRequestParam, CartType } from '../models/cart.model';
import { CurriculumManagementNode } from '../models/curriculum-manager.model';
import { CartService } from './cart.service';
import { Observable, of, forkJoin, throwError } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable()
export class CurriculumManagerService extends NgxExcelDataService<CurriculumManagementNode> {

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected bankService: BankService,
    protected instalmentService: BankInstalmentService,
    protected productService: StudentBoughtProductService,
    protected subjectService: StudentBoughtSubjectService,
    protected curriculumService: StudentBoughtCurriculumService,
    protected availableProductService: SchoolAvailableProductService,
    protected availableSubjectService: SchoolAvailableSubjectService,
    protected availableCurriculumService: SchoolAvailableCurriculumService
  ) {
    super();
  }

  /**
   * @inheritdoc
   */
  public getRules(): NgxExcelModelColumnRules<CurriculumManagementNode> {
    const productRules = this.productService.getRules();
    const subjectRules = this.subjectService.getRules();
    const rules: any = {};
    rules.id = {
      label: '虚拟主键', columnType: NgxExcelColumnType.PrimaryKey
    };
    rules.level = {
      label: '层级', columnType: NgxExcelColumnType.Number
    };
    rules.relativeProduct = {
      label: '关联的产品', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.productService, labelKey: 'name'
    };
    rules.relativeSubject = {
      label: '关联的科目', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.subjectService, labelKey: 'name'
    };
    rules.canBindTeacher = {
      label: '是否允许绑定老师？', columnType: NgxExcelColumnType.Bool, default: false
    };
    rules.name = productRules.name;
    rules.type = productRules.type;
    rules.startTime = productRules.startTime;
    rules.endTime = productRules.endTime;
    rules.remainedCurriculumCount = productRules.remainedCurriculumCount;
    rules.consumedCurriculumCount = productRules.consumedCurriculumCount;
    rules.lockedCurriculumCount = productRules.lockedCurriculumCount;
    rules.overdueCurriculumCount = productRules.overdueCurriculumCount;
    rules.deprecatedCurriculumCount = productRules.deprecatedCurriculumCount;
    rules.curriculumCount = productRules.curriculumCount;
    rules.relativeTeacher = subjectRules.relativeTeacher;
    Object.keys(rules).forEach((ruleKey) => rules[ruleKey].name = ruleKey);
    return rules;
  }

  /**
   * 获得学员的课程管理节点
   * @param filters 查询条件
   */
  public getCurriculumManagementNodes(filters: { schoolId: string, studentId: string }): Observable<CurriculumManagementNode[]> {
    return this.productService.getList(filters).pipe(
      mergeMap((products: StudentBoughtProduct[]) => {
        const productsStream = of(products);
        const subjectsStreams: Observable<StudentBoughtSubject[]>[] = [];
        products.forEach((product) => {
          subjectsStreams.push(
            this.getBoughtSubjects(Object.assign(filters, { productId: product.id })) as Observable<StudentBoughtSubject[]>
          );
        });
        return forkJoin([productsStream, ...subjectsStreams]);
      }),
      map((resultSet: any[]) => {
        const curriculumManagementNodes: CurriculumManagementNode[] = [];
        const products = resultSet[0] as StudentBoughtProduct[];
        const subjectsSets = [...resultSet.slice(1)] as StudentBoughtSubject[][];
        this.productService.getProductTypes().forEach((productType) => {
          products.filter((product) => product.type.value === productType.value).forEach((product) => {
            const productNode = this.createModel(product, 0);
            const subjectSet = subjectsSets.find(
              (subjects) => subjects.some(
                (subject) => subject.relativeProduct.id === productNode.relativeProduct.id
              )
            );
            // 没有找到对应的科目则跳过产品
            if (!subjectSet) { return; }
            curriculumManagementNodes.push(productNode);
            const subjectNodes = subjectSet.map((subject) => this.createModel(subject, 1));
            curriculumManagementNodes.push(...subjectNodes);
          });
        });
        return curriculumManagementNodes;
      })
    );
  }

  /**
   * 根据产品获得学员已购科目列表
   * @param filters 查询条件
   */
  public getBoughtSubjects(
    filters: { schoolId: string, studentId: string, productId: string }
  ): Observable<StudentBoughtSubject[]> {
    if (this.dataSet && this.dataSet.length > 0) {
      return of(this.dataSet
        .filter((data) => data.level === 1 && data.relativeProduct.id === filters.productId)
        .map((data) => data.relativeSubject));
    }

    return this.subjectService.getList(filters);
  }

  /**
   * 根据产品和科目获得学员已购课程列表
   * @param filters 查询条件
   */
  public getBoughtCurriculums(
    filters: { schoolId: string, studentId: string, productId: string, subjectId: string }
  ): Observable<StudentBoughtCurriculum[]> {
    return this.curriculumService.getList(filters);
  }

  /**
   * 创建课程管理节点模型
   * @param o 学员已购产品/科目模型
   * @param level 层级（0 - 产品  1 - 科目）
   */
  public createModel(o: StudentBoughtProduct | StudentBoughtSubject, level = 0) {
    const node = {
      level,
      startTime: o.startTime,
      endTime: o.endTime,
      remainedCurriculumCount: o.remainedCurriculumCount,
      consumedCurriculumCount: o.consumedCurriculumCount,
      lockedCurriculumCount: o.lockedCurriculumCount,
      overdueCurriculumCount: o.overdueCurriculumCount,
      curriculumCount: o.curriculumCount
    } as CurriculumManagementNode;
    return level === 0 ?
      this._createModelFromStudentBoughtProduct(node, o as StudentBoughtProduct) :
      this._createModelFromStudentBoughtSubject(node, o as StudentBoughtSubject);
  }

  /**
   * 根据学员和操作类型获得购物车服务对象
   * @param currentSchool 当前校区
   * @param currentStudent 当前学员
   * @param name 操作类型
   */
  public getCartService(currentSchool: School, currentStudent: Student, name: CartType) {
    const cartService = new CartService(
      this.httpClient,
      this.backendService,
      this.bankService,
      this.instalmentService,
      this.availableProductService,
      this.availableSubjectService
    );
    const cartType = cartService.getCartType(name);
    if (!cartType) {
      return throwError(new Error('不合法的操作类型'));
    }
    return cartService.initial(currentSchool, currentStudent, cartType);
  }

  /**
   * 同产品换课
   * @param cartService 购物车服务
   * @param payload 请求参数
   */
  public autoSwapCurriculums(cartService: CartService, requestParams: CartRequestParam[]): Observable<boolean> {
    const requestStreams = requestParams.map((requestParam) => requestParam.isRefund ?
          cartService.refundToCart(requestParam, true) : cartService.addToCart(requestParam, true));

    return forkJoin(requestStreams).pipe(
      // mergeMap(() => cartService.getBills()),
      mergeMap(() => cartService.createContracts()),
      map(() => true)
    );
  }

  /**
   * 通过学员已购产品创建模型差异属性
   * @param node 管理节点模型（公用属性）
   * @param product 学员已购产品模型
   */
  private _createModelFromStudentBoughtProduct(node: CurriculumManagementNode, product: StudentBoughtProduct): CurriculumManagementNode {
    node.id = JSON.stringify({ productId: product.id, level: node.level });
    node.name = product.name;
    node.type = product.type;
    node.relativeProduct = product;
    node.relativeSubject = null;
    node.relativeTeacher = null;
    node.canBindTeacher = false;
    if (!(this.productService.getEtpProductTypes().some((productType) => productType.value === node.type.value))) {
      // 非 ETP 产品类型的产品上不需要显示开始时间 和 结束时间
      node.startTime = null;
      node.endTime = null;
    }
    return node;
  }

  /**
   * 通过学员已购科目创建模型差异属性
   * @param node 管理节点模型（公用属性）
   * @param subject 学员已购科目模型
   */
  private _createModelFromStudentBoughtSubject(node: CurriculumManagementNode, subject: StudentBoughtSubject): CurriculumManagementNode {
    node.id = JSON.stringify({ productId: subject.relativeProduct.id, subjectId: subject.id, level: node.level });
    node.name = subject.name;
    node.type = subject.relativeProduct.type;
    node.relativeProduct = subject.relativeProduct;
    node.relativeSubject = subject;
    node.relativeTeacher = subject.relativeTeacher;
    // todo: 只有 VIP 和 VIP_CLASS 的课可以绑定上课老师，应该用权限决定是否可绑定
    node.canBindTeacher = this.productService.getVipProductTypes().some((productType) => productType.value === node.type.value);
    if (this.productService.getEtpProductTypes().some((productType) => productType.value === node.type.value)) {
      // ETP 产品类型的科目上不需要显示开始时间 和 结束时间
      node.startTime = null;
      node.endTime = null;
      node.remainedCurriculumCount = -1;
      node.overdueCurriculumCount = -1;
      node.deprecatedCurriculumCount = -1;
      node.curriculumCount = -1;
    }
    return node;
  }

}
