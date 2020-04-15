import { Output, ChangeDetectorRef, EventEmitter, ComponentFactoryResolver, Inject, Injector } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { CartService } from '../../services/cart.service';

export abstract class CurriculumBlockComponent {

  componentReady: boolean;

  @Output() componentReadyChange = new EventEmitter<boolean>();

  constructor(
    protected cdr: ChangeDetectorRef,
    protected cfr: ComponentFactoryResolver,
    protected injector: Injector,
    protected message: NzMessageService,
    @Inject(CartService) protected cartService: CartService,
  ) { }

  /**
   * 通知父组件是否已准备完成
   * @param componentReadySignal 准备信号
   */
  protected sendComponentReady(componentReadySignal: boolean) {
    this.componentReady = componentReadySignal;
    this.componentReadyChange.emit(this.componentReady);
  }

}
