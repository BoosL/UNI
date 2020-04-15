import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
  ComponentFactoryResolver,
  Injector,
  Inject
} from '@angular/core';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { NzMessageService } from 'ng-zorro-antd';
import { INgxExcelDataSource, NgxExcelModelColumnRules, NgxExcelComponentService } from 'ngx-excel';
import { SelectOption } from '@uni/core';
import { CartService } from '../../../../services/cart.service';
import { CurriculumBlockSwapComponent } from '../curriculum-block-swap-component';
import { CurriculumBlockSwapNoNode } from '../curriculum-block-swap.model';
import { CurriculumBlockSwapNoDataService } from './curriculum-block-swap-no-data.service';
import { CurriculumBlockSwapNoComponentService } from './curriculum-block-swap-no-component.service';
import { Observable } from 'rxjs';
import { tap, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'curriculum-block-swap-no.curriculum-block',
  templateUrl: './curriculum-block-swap-no.component.html',
  providers: [
    { provide: INgxExcelDataSource, useClass: CurriculumBlockSwapNoDataService },
    { provide: NgxExcelComponentService, useClass: CurriculumBlockSwapNoComponentService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurriculumBlockSwapNoComponent extends CurriculumBlockSwapComponent<CurriculumBlockSwapNoNode> implements OnInit {

  rules: NgxExcelModelColumnRules<CurriculumBlockSwapNoNode>;
  context: CurriculumBlockSwapNoNode;
  cantExpectButton: boolean;
  expectedCurriculumSwapNodes: CurriculumBlockSwapNoNode[];
  resultCurriculumSwapNodes: CurriculumBlockSwapNoNode[];

  // tslint:disable-next-line: variable-name
  private _buyMode: SelectOption;

  @ViewChildren(PerfectScrollbarDirective) scrollDirectives: QueryList<PerfectScrollbarDirective>;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected cfr: ComponentFactoryResolver,
    protected injector: Injector,
    protected message: NzMessageService,
    @Inject(CartService) protected cartService: CartService,
    protected dataService: INgxExcelDataSource<CurriculumBlockSwapNoNode>,
    protected componentService: NgxExcelComponentService
  ) {
    super(cdr, cfr, injector, message, cartService, dataService);
  }

  ngOnInit() {
    super.ngOnInit();
    this._buyMode = this.cartService.getCurriculumNoMode();
    this.context = {
      id: `${Math.round((new Date()).getTime() / 1000)}`,
      relativeProduct: null,
      relativeSubject: null,
      relativeCurriculum: null,
      isBoughtCurriculum: false,
      isExpectedCurriculum: false
    };
    this.cantExpectButton = false;
    this.expectedCurriculumSwapNodes = [];
    this.resultCurriculumSwapNodes = [];
    this.rules = this.getDataService().getRules();
    const relativeSubjectIdChangeSubscription = this.getComponentService().getRelativeSubjectIdChangeStream().pipe(
      mergeMap((subjectId) => this.initialBySubjectId(subjectId))
    ).subscribe(
      (curriculumSwapNodes) => {
        this.curriculumSwapNodes = [...curriculumSwapNodes];
        this.cdr.detectChanges();
      },
      (e) => this.message.error(e.message || '系统错误，请联系管理员')
    );
    this.componentSubscription.add(relativeSubjectIdChangeSubscription);
  }

  /**
   * 当期望按钮被点击时执行
   * @param e 事件
   * @param node 当前节点
   */
  handleExpectButtonClick(e: Event, node: CurriculumBlockSwapNoNode) {
    e.stopPropagation();
    e.preventDefault();
    node.isExpectedCurriculum = true;
    this.handleResultCurriculumSwapNodesChange(node);
  }

  /**
   * 当不期望按钮被点击时执行
   * @param e 事件
   * @param node 当前节点
   */
  handleUnExpectButtonClick(e: Event, node: CurriculumBlockSwapNoNode) {
    e.stopPropagation();
    e.preventDefault();
    node.isExpectedCurriculum = false;
    this.handleResultCurriculumSwapNodesChange(node);
  }

  /**
   * 当结果节点发生变化时执行
   * @param node 当前节点
   */
  handleResultCurriculumSwapNodesChange(node: CurriculumBlockSwapNoNode) {
    const idJson = JSON.parse(node.id);
    const resultCurriculumSwapNodes = this.resultCurriculumSwapNodes.filter((resultNode) => {
      const resultIdJson = JSON.parse(resultNode.id);
      // tslint:disable-next-line: max-line-length
      return idJson.productId !== resultIdJson.productId || idJson.subjectId !== resultIdJson.subjectId || idJson.curriculumId !== resultIdJson.curriculumId;
    });
    if (node.isBoughtCurriculum === !node.isExpectedCurriculum) {
      resultCurriculumSwapNodes.push(node);
    }
    this.resultCurriculumSwapNodes = [...resultCurriculumSwapNodes];
    this.complementaryChange.emit(this.computeComplementary());
    this.cdr.detectChanges();
  }

  /**
   * 当滚动课程列表时执行
   * @param e 事件
   */
  handleCurriculumsScroll(e: CustomEvent) {
    const scrollTop = (e.target as HTMLElement).scrollTop;
    this.scrollDirectives.forEach((scrollDirective) => {
      scrollDirective.scrollToY(scrollTop);
    });
  }

  /**
   * @inheritdoc
   */
  protected initial(): Observable<CurriculumBlockSwapNoNode[]> {
    const filters = {
      schoolId: this.cartService.getCurrentSchool().id,
      studentId: this.cartService.getCurrentStudent().id,
      productId: this.currentProduct.id,
    };
    if (this.currentSubject) {
      // tslint:disable-next-line: no-string-literal
      filters['subjectId'] = this.currentSubject.id;
    }
    return this.initialBySubjectId(this.currentSubject ? this.currentSubject.id : null);
  }

  protected initialBySubjectId(subjectId?: string) {
    const filters = {
      schoolId: this.cartService.getCurrentSchool().id,
      studentId: this.cartService.getCurrentStudent().id,
      productId: this.currentProduct.id
    };
    if (subjectId) {
      // tslint:disable-next-line: no-string-literal
      filters['subjectId'] = subjectId;
    }
    return this.getDataService().getCurriculumSwapNodes(filters).pipe(
      tap((nodes) => {
        if (nodes.length === 0) {
          throw new Error('无法获得当前产品的课程列表');
        }
        this.context.relativeProduct = Object.assign({}, nodes[0].relativeProduct);
        this.context.relativeSubject = Object.assign({}, nodes[0].relativeSubject);
        this.expectedCurriculumSwapNodes = [
          ...nodes.map((node) => {
            const idJson = JSON.parse(node.id);
            const matchedResultCurriculumSwapNode = this.resultCurriculumSwapNodes.find((resultNode) => {
              const resultIdJson = JSON.parse(resultNode.id);
              // tslint:disable-next-line: max-line-length
              return idJson.productId === resultIdJson.productId && idJson.subjectId === resultIdJson.subjectId && idJson.curriculumId === resultIdJson.curriculumId;
            });
            return Object.assign({}, matchedResultCurriculumSwapNode || node);
          })
        ];
      })
    );
  }

  /**
   * @inheritdoc
   */
  public getRequestParams() {
    return this.getDataService().nodes2requestParams(this.resultCurriculumSwapNodes).map((requestParam) => {
      requestParam.buyMode = this._buyMode;
      return requestParam;
    });
  }

  /**
   * @inheritdoc
   */
  protected computeComplementary() {
    let remainedCurriculumCount = 0;
    let expectedCurriculumCount = 0;
    this.resultCurriculumSwapNodes.forEach((resultNode) => {
      if (resultNode.isBoughtCurriculum === resultNode.isExpectedCurriculum) { return; }
      if (resultNode.isBoughtCurriculum) {
        remainedCurriculumCount += 1;
      } else {
        expectedCurriculumCount += 1;
      }
    });

    const complementary = remainedCurriculumCount - expectedCurriculumCount;
    this.cantExpectButton = complementary <= 0;
    return complementary;
  }

  /**
   * 获得组件服务
   */
  protected getComponentService(): CurriculumBlockSwapNoComponentService {
    return this.componentService as CurriculumBlockSwapNoComponentService;
  }

}
