import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ComponentRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { CurriculumBlockPurchaseComponent } from '../../curriculum-blocks/curriculum-blocks';
import { CurriculumFlowComponent } from '../curriculum-flow-component';

@Component({
  selector: 'curriculum-flow-purchase.curriculum-flow',
  templateUrl: './curriculum-flow-purchase.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurriculumFlowPurchaseComponent extends CurriculumFlowComponent implements OnInit, OnDestroy {

  loading: boolean;
  agreement: boolean;

  // tslint:disable: variable-name
  private _blockComponent: ComponentRef<CurriculumBlockPurchaseComponent>;

  @ViewChild('curriculumBlockContainer', { read: ViewContainerRef, static: false }) protected container: ViewContainerRef;

  /**
   * @inheritdoc
   */
  public confirm(e: Event) {
    e.stopPropagation();
    e.preventDefault();

    if (!this.agreement) {
      this.message.error('请先确认购课清单信息');
      return;
    }

    this.drawerRef.close(true);
  }

  protected initial() {
    if (!this.container) { return; }
    if (this._blockComponent) {
      this.container.clear();
    }
    this._blockComponent = this.createCurriculumBlock<CurriculumBlockPurchaseComponent>(CurriculumBlockPurchaseComponent);
    this._blockComponent.instance.componentReadyChange.subscribe((componentReadySignal: boolean) => {
      this.componentReady = componentReadySignal;
      this.cdr.detectChanges();
    });
    this.container.insert(this._blockComponent.hostView);
    this.cdr.detectChanges();
  }

  /**
   * 创建块组件
   * @param componentType 组件类
   */
  /* private _createBlockComponent(
    componentType: Type<CurriculumBlockSwapComponent<CurriculumSwapCountNode | CurriculumSwapNoNode>>
  ): ComponentRef<CurriculumSwapBlockComponent<CurriculumSwapCountNode | CurriculumSwapNoNode>> {
    this.componentReady = false;
    const factory = this.cfr.resolveComponentFactory(componentType);
    const component = factory.create(this.injector);
    component.instance.currentStudent = this.currentStudent;
    component.instance.complementaryChange.subscribe((complementary: number) => {
      this.complementary = complementary;
      this.cdr.detectChanges();
    });
    component.instance.componentReadyChange.subscribe((componentReady: boolean) => {
      this.componentReady = componentReady;
      this.cdr.detectChanges();
    });
    return component;
  } */

}
