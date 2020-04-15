import {
  OnInit,
  OnDestroy,
  Input,
  ChangeDetectorRef,
  AfterViewInit,
  Output,
  EventEmitter,
  ComponentFactoryResolver,
  Injector,
  Inject
} from '@angular/core';
import { StudentBoughtProduct, StudentBoughtSubject, SchoolMenuService, Student, School } from '@uni/core';
import { NzMessageService } from 'ng-zorro-antd';
import { INgxExcelDataSource } from 'ngx-excel';
import { CartRequestParam } from '../../../models/cart.model';
import { CartService } from '../../../services/cart.service';
import { CurriculumBlockComponent } from '../curriculum-block-component';
import { CurriculumBlockSwapDataService } from './curriculum-block-swap-data-service';
import { Subscription, Observable } from 'rxjs';

export abstract class CurriculumBlockSwapComponent<T> extends CurriculumBlockComponent implements OnInit, AfterViewInit, OnDestroy {

  componentReady: boolean;
  curriculumSwapNodes: T[];

  protected componentSubscription = new Subscription();

  @Input() currentProduct: StudentBoughtProduct;
  @Input() currentSubject: StudentBoughtSubject;
  @Output() complementaryChange = new EventEmitter<number>();

  constructor(
    protected cdr: ChangeDetectorRef,
    protected cfr: ComponentFactoryResolver,
    protected injector: Injector,
    protected message: NzMessageService,
    @Inject(CartService) protected cartService: CartService,
    protected dataService: INgxExcelDataSource<T>,
  ) {
    super(cdr, cfr, injector, message, cartService);
  }

  ngOnInit() {
    this.curriculumSwapNodes = [];
    this.sendComponentReady(false);
  }

  ngOnDestroy() {
    this.componentSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    const initialSubscription = this.initial().subscribe((curriculumSwapNodes: T[]) => {
      this.curriculumSwapNodes.push(...curriculumSwapNodes);
      this.sendComponentReady(true);
      this.complementaryChange.emit(this.computeComplementary());
      this.cdr.detectChanges();
    }, (e) => {
      this.message.error(e.message || '系统错误，请联系管理员');
    });
    this.componentSubscription.add(initialSubscription);
  }

  /**
   * 获得数据供应服务
   */
  protected getDataService(): CurriculumBlockSwapDataService<T> {
    return this.dataService as CurriculumBlockSwapDataService<T>;
  }

  /**
   * 获得调整课时 / 课号请求数据
   */
  public abstract getRequestParams(): CartRequestParam[];

  /**
   * 初始化组件
   */
  protected abstract initial(): Observable<T[]>;

  /**
   * 发送补全数据
   */
  protected abstract computeComplementary(): number;

}
