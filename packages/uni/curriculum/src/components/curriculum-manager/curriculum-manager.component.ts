import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NzTreeNode, NzMessageService, NzTreeNodeOptions } from 'ng-zorro-antd';
import { ProductService, ProductSubjectService, SelectOption, Product, ProductSubject } from '@uni/core';
import { Observable, BehaviorSubject, of, Subject, Subscription } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'curriculum-manager',
  templateUrl: './curriculum-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurriculumManagerComponent implements OnInit, OnDestroy {

  productTreeNodes$: Observable<NzTreeNode[]>;
  curriculumsFilters$: Observable<{ [name: string]: string | string[] }>;
  searchProductType = '';
  searchKeyword = '';
  searching = false;

  get productTypes(): SelectOption[] {
    return this.productService.getProductTypes();
  }

  // tslint:disable: variable-name
  private _productTreeNodesStream = new BehaviorSubject<NzTreeNode[]>([]);
  private _curriculumsFiltersStream = new BehaviorSubject<{ [name: string]: string | string[] }>(null);
  private _extraFilters: { [name: string]: string | string[] } = {};
  private _searchStream = new Subject<{ type: string; keyword: string; }>();
  private _componentSubscription = new Subscription();

  @Input() extraFilters$: Observable<{ [name: string]: string | string[] }>;

  expandCallback = (node: NzTreeNode) => {
    const keyJson = JSON.parse(node.key);
    return node.level === 0 ? this._getProducts(keyJson.productType) : this._getSubjects(keyJson.productId);
  }

  constructor(
    protected cdr: ChangeDetectorRef,
    protected message: NzMessageService,
    protected productService: ProductService,
    protected subjectService: ProductSubjectService
  ) { }

  ngOnInit() {
    this.productTreeNodes$ = this._productTreeNodesStream.asObservable();
    this.curriculumsFilters$ = this._curriculumsFiltersStream.asObservable();
    (this.extraFilters$ || of({})).subscribe((extraFilters) => {
      this._extraFilters = extraFilters;
      this._rebuildUi();
    });

    const searchSubscription = this._searchStream.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      // switchMap方式触发搜索请求防止照成过大的服务器压力
      switchMap((condition) => {
        if (condition.keyword) {
          this.searching = true;
          this.cdr.detectChanges();
          return this.productService.getList(Object.assign({}, this._extraFilters, condition)).pipe(
            map((products) => {
              const productTypeMap: { [name: string]: NzTreeNode[] } = {};
              products.forEach((product) => {
                const productType = product.type || null;
                // const productTypeValue = product.type ? product.type.value : null;
                if (!productType) { return; }
                const productTypeTreeNode = this._productType2TreeNode(productType);
                if (!productTypeMap[productTypeTreeNode.key]) {
                  productTypeMap[productTypeTreeNode.key] = [];
                }
                productTypeMap[productTypeTreeNode.key].push(this._product2TreeNode(product));
              });
              return this.productService.getProductTypes().map((productType) => {
                const node = this._productType2TreeNode(productType) as NzTreeNodeOptions;
                if (productTypeMap[node.key]) {
                  node.children = productTypeMap[node.key];
                  node.expanded = true;
                }
                return node;
              }).filter((node) => node.children && node.children.length > 0);
            })
          );
        }
        const nodes = this.productService.getProductTypes()
          .map(this._productType2TreeNode)
          .filter((productType) => {
            if (!condition.type) { return true; }
            const keyJson = JSON.parse(productType.key);
            return keyJson.productType === condition.type;
          });
        return of(nodes);
      }),
    ).subscribe((nodes) => {
      this.searching = false;
      this.cdr.detectChanges();
      this._productTreeNodesStream.next(nodes as NzTreeNode[]);
    }, (e) => {
      this.searching = false;
      this.cdr.detectChanges();
      this.message.error(e.message || '系统错误，请联系管理员');
      this._productTreeNodesStream.next([]);
    });
    this._componentSubscription.add(searchSubscription);
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  /**
   * 当搜索条件发生变化时执行
   * @param _ 事件
   */
  handleSearchChange(_: Event) {
    const searchCondition = { type: '', keyword: '' };
    searchCondition.type = this.searchProductType || '';
    searchCondition.keyword = this.searchKeyword;
    this._searchStream.next(searchCondition);
  }

  /**
   * 当叶子节点被选中时执行
   * @param node 树节点
   */
  handleNodeSelect(node: NzTreeNode) {
    if (!node.origin.isLeaf) { return; }
    const keyJson = JSON.parse(node.key);
    const filters = Object.assign({}, keyJson, this._extraFilters);
    this._curriculumsFiltersStream.next(filters);
  }

  /**
   * 获得产品列表
   * @param type 产品类型枚举值
   */
  private _getProducts(type: string) {
    return this.productService.getList(Object.assign({}, this._extraFilters, { type })).pipe(
      map((products) => products.map(this._product2TreeNode)),
      catchError((e) => {
        this.message.error(e.message || '系统错误，请联系管理员');
        return of([]);
      })
    );
  }

  /**
   * 获得科目列表
   * @param productId 产品主键
   */
  private _getSubjects(productId: string) {
    return this.subjectService.getList(Object.assign({}, this._extraFilters, { productId })).pipe(
      map((subjects) => subjects.map(this._subject2TreeNode)),
      catchError((e) => {
        this.message.error(e.message || '系统错误，请联系管理员');
        return of([]);
      })
    );
  }

  /**
   * 重建Ui
   */
  private _rebuildUi() {
    const nodes = this.productService.getProductTypes().map((productType) => this._productType2TreeNode(productType));
    this.searchKeyword = '';
    this.searchProductType = '';
    this.searching = false;
    this._productTreeNodesStream.next(nodes);
    this._curriculumsFiltersStream.next(null);
  }

  /**
   * 产品类型转化为树节点
   * @param productType 产品类型
   */
  private _productType2TreeNode(productType: SelectOption): NzTreeNode {
    const keyJson = {
      productType: productType.value
    };
    return { key: JSON.stringify(keyJson), title: productType.label, level: 0 } as NzTreeNode;
  }

  /**
   * 产品转化为树节点
   * @param product 产品
   */
  private _product2TreeNode(product: Product): NzTreeNode {
    const keyJson = {
      productType: product.type.value,
      productId: product.id
    };
    return { key: JSON.stringify(keyJson), title: product.name, level: 1 } as NzTreeNode;
  }

  /**
   * 科目转化为树节点
   * @param subject 科目
   */
  private _subject2TreeNode(subject: ProductSubject): NzTreeNode {
    const keyJson = {
      productType: subject.relativeProduct.type.value,
      productId: subject.relativeProduct.id,
      subjectId: subject.id
    };
    return { key: JSON.stringify(keyJson), title: subject.name, level: 2, isLeaf: true } as NzTreeNode;
  }

}
