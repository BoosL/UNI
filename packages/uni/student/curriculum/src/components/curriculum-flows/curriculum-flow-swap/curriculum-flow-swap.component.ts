import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  Type,
} from '@angular/core';
import { StudentBoughtProduct, StudentBoughtSubject } from '@uni/core';
import { CurriculumFlowComponent } from '../curriculum-flow-component';
import {
  CurriculumBlockSwapCountNode,
  CurriculumBlockSwapNoNode,
  CurriculumBlockSwapComponent,
  CurriculumBlockSwapCountComponent,
  CurriculumBlockSwapNoComponent
} from '../../curriculum-blocks/curriculum-blocks';
import { of } from 'rxjs';
import { tap, delay, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'curriculum-flow-swap.curriculum-flow',
  templateUrl: './curriculum-flow-swap.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurriculumFlowSwapComponent extends CurriculumFlowComponent implements OnInit, OnDestroy {

  complementary: number;
  modeButtons = [
    { name: 'count', label: '课时模式', active: false, component: CurriculumBlockSwapCountComponent },
    { name: 'no', label: '课号模式', active: false, component: CurriculumBlockSwapNoComponent }
  ];

  // tslint:disable: variable-name
  private _blockComponent: ComponentRef<CurriculumBlockSwapComponent<CurriculumBlockSwapCountNode | CurriculumBlockSwapNoNode>>;

  @Input() currentProduct: StudentBoughtProduct;
  @Input() currentSubject: StudentBoughtSubject;

  @ViewChild('curriculumSwapBlockContainer', { read: ViewContainerRef, static: false }) protected container: ViewContainerRef;

  ngOnInit() {
    super.ngOnInit();
    this.complementary = 0;
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    if (this._blockComponent) {
      this._blockComponent.destroy();
    }
  }

  /**
   * @inheritdoc
   */
  protected initial() {
    this.handleModeButtonClick(null, this.modeButtons[0]);
  }

  /**
   * @inheritdoc
   */
  public confirm(e: Event) {
    e.stopPropagation();
    e.preventDefault();

    if (!this._blockComponent) { return; }

    if (this.complementary < 0) {
      this.message.error('调整后的课时 / 课号超出预期');
      return;
    }

    if (this.complementary > 0) {
      this.message.error('尚有待分配课时 / 课号');
      return;
    }

    of(null).pipe(
      tap(() => this.loading = true),
      delay(200),
      map(() => this._blockComponent.instance.getRequestParams()),
      mergeMap((requestParams) => requestParams.length > 0 ?
        this.curriculumManagerService.autoSwapCurriculums(this.cartService, requestParams) : of(false)
      )
    ).subscribe(
      (success) => this.drawerRef.close(success),
      (error) => {
        this.loading = false;
        this.message.error(error.message || '系统错误，请联系管理员');
        this.cdr.detectChanges();
      }
    );
  }

  /**
   * 当模式按钮被点击时执行
   * @param e 事件
   * @param currentModeButton 当前点击的模式按钮
   */
  handleModeButtonClick(e: Event, currentModeButton: any) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (!this.container) { return; }
    if (this._blockComponent) {
      this.container.clear();
    }

    this._blockComponent = this._createBlockComponent(currentModeButton.component);
    this.container.insert(this._blockComponent.hostView);

    this.modeButtons.forEach((modeButton) => modeButton.active = false);
    currentModeButton.active = true;
    this.cdr.detectChanges();
  }

  /**
   * 创建块组件
   * @param componentType 组件类
   */
  private _createBlockComponent(
    componentType: Type<CurriculumBlockSwapComponent<CurriculumBlockSwapCountNode | CurriculumBlockSwapNoNode>>
  ): ComponentRef<CurriculumBlockSwapComponent<CurriculumBlockSwapCountNode | CurriculumBlockSwapNoNode>> {
    this.componentReady = false;
    // tslint:disable-next-line: max-line-length
    const component = this.createCurriculumBlock<CurriculumBlockSwapComponent<CurriculumBlockSwapCountNode | CurriculumBlockSwapNoNode>>(componentType);
    component.instance.currentProduct = this.currentProduct;
    component.instance.currentSubject = this.currentSubject;
    component.instance.complementaryChange.subscribe((complementary: number) => {
      this.complementary = complementary;
      this.cdr.detectChanges();
    });
    component.instance.componentReadyChange.subscribe((componentReady: boolean) => {
      this.componentReady = componentReady;
      this.cdr.detectChanges();
    });
    return component;
  }

}
