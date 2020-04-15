import {
  EventEmitter,
  Output, ChangeDetectorRef, ElementRef, Renderer2
} from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';
import {
  NzMessageService, NzDrawerService
} from 'ng-zorro-antd';
import {debounceTime, distinctUntilChanged, filter, map, share, tap} from 'rxjs/operators';
import {ProductService} from '@uni/core';
import {CdkDrag, CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop';
import {CurriculumSchedulesStateService} from '../../services/curriculum-schedules-state.service';

export class CurriculumSchedulesBaseGridComponent {
  public dragIsStart = false;
  // tslint:disable: variable-name
  protected _componentSubscription = new Subscription();
  protected _columnCount = 0;
  private _excelEl;
  private _excelScrollBarX;
  private _excelScrollBarXPercent;
  private _columnWidth = 150;
  private _scrollbarScrolling = false;
  private _tableScrolling = false;
  @Output() handleClassroomDrag = new EventEmitter<any>();
  constructor(
    protected message: NzMessageService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected drawer: NzDrawerService,
    protected productService: ProductService,
    protected el: ElementRef,
    protected renderer2: Renderer2,
    protected dataService: CurriculumSchedulesStateService
  ) {
  }
  /**
   * 设置横向滚动条宽度
   */
  protected _setScrollBarWidth() {
    this._excelEl = this.el.nativeElement.querySelector('.curriculum-schedules-container');
    this._excelScrollBarX = this.el.nativeElement.querySelector('.excel-foot .scrollbar-x');
    const columnsWidth = (this._columnCount + 1) * this._columnWidth;
    const elBarOuterWidth = parseInt(getComputedStyle(this.el.nativeElement, null).width, 10);
    const scheduleTimeWidth = parseInt(getComputedStyle(this.el.nativeElement.querySelector('.schedule-time'), null).width, 10);
    if (elBarOuterWidth !== 1 && (columnsWidth + scheduleTimeWidth) > elBarOuterWidth) {
      const scrollBarOuterWidth = parseInt(getComputedStyle(this._excelScrollBarX, null).width, 10);
      this._excelScrollBarXPercent = Math.round((scrollBarOuterWidth / elBarOuterWidth) * 10000) / 10000;
      const scrollBarWidth = Math.ceil((columnsWidth + scheduleTimeWidth + 9) * this._excelScrollBarXPercent);
      this.renderer2.setStyle(this._excelScrollBarX.querySelector('span'), 'width', scrollBarWidth + 'px');
      this.registerExcelBodyScrolled();
      this.registerScrollBarScrolled();
    } else {
      this.renderer2.setStyle(this._excelScrollBarX.querySelector('span'), 'width', 1 + 'px');
    }
  }

  /**
   * 注册table滚动事件
   */
  protected registerExcelBodyScrolled() {
    const source = fromEvent(this._excelEl, 'scroll').pipe(
      filter(() => !this._scrollbarScrolling),
      share()
    );

    this._componentSubscription.add(
      source.pipe(debounceTime(200))
      .subscribe(() => this._tableScrolling = false)
    );

    this._componentSubscription.add(
      source
      .pipe(tap(() => this._tableScrolling = true))
      .subscribe(() => {
        this.handleExcelBodyScrolled();
      })
    );
  }


  /**
   * 注册ScrollBarX滚动事件
   */
  protected registerScrollBarScrolled() {
    const source = fromEvent(this._excelScrollBarX, 'scroll').pipe(
      map((e: Event) => (e.srcElement as HTMLElement).scrollLeft),
      distinctUntilChanged(),
      filter(() => !this._tableScrolling),
      share()
    );

    this._componentSubscription.add(
      source.pipe(debounceTime(200))
      .subscribe(() => this._scrollbarScrolling = false)
    );

    this._componentSubscription.add(
      source
      .pipe(tap(() => this._scrollbarScrolling = true))
      .subscribe(() => {
        this.handleScrollBarScrolled();
      })
    );
  }
  /**
   * 当滑动滚动条执行
   */
  protected handleScrollBarScrolled() {
    const radio = Math.ceil(this._excelEl.offsetWidth / this._excelScrollBarX.offsetWidth);
    const excelVerticalScrollLeft = Math.ceil(this._excelScrollBarX.scrollLeft * radio);
    this._excelEl.scrollLeft = excelVerticalScrollLeft;
  }

  /**
   * 当table滚动时执行
   */
  protected handleExcelBodyScrolled() {
    this._excelScrollBarX.scrollLeft = Math.ceil(this._excelEl.scrollLeft * this._excelScrollBarXPercent);
  }

  /**
   * 拖动
   */
  public drop(event: CdkDragDrop<string[]>) {
    this.handleClassroomDrag.emit(event);
  }

  /**
   * 开始拖动
   */
  public dragStart(event: CdkDragDrop<string[]>) {
    this.dragIsStart = true;
    this.changeDetectorRef.markForCheck();
  }

  /**
   * 结束拖动
   */
  public dragEnd(event: CdkDragDrop<string[]>) {
    this.dragIsStart = false;
    this.changeDetectorRef.markForCheck();
  }

  /**
   * 拖动限制
   */
  public dropLimit(drag: CdkDrag, drop: CdkDropList) {
    if (drag.data && drag.data.schedule) {
      // 两个排课不能相互拖拽
      if (drop.data[0] && drop.data[0].schedule) {
        return false;
      }
      if (drop.data[0].classroom) {
        // 禁用教室不能被拖入
        if (drop.data[0].classroom.status.value === '0') {
          return false;
        }
        // 不在同一时段不能拖入
        if (drag.data.schedule.time.substr(0, 16) !== drop.data[0].schoolResource.datetime.substr(0, 16)) {
          return false;
        }
      }
    }
    if (drag.data && drag.data.classroom && drop.data[0] && drop.data[0].schoolResource) {
      // 禁用校区时间不能拖入
      if (drop.data[0].schoolResource.allClassrooms && drop.data[0].schoolResource.allTeachers) {
        return false;
      }
      // 该时段被占用教室不能拖入
      for (const item of drop.data[0].schoolResource.classrooms) {
        if (item.id.toString() === drag.data.classroom.id) {
          this.dragIsStart = true;
          return false;
        }
      }
    }
    return true;
  }
}
