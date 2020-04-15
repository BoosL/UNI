import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
  AfterViewInit,
  Input
} from '@angular/core';
import { NzMessageService, NzDrawerService, NzModalService, NzDrawerOptions } from 'ng-zorro-antd';
import { INgxExcelDataSource, NgxExcelComponent, NgxExcelContextChanged } from 'ngx-excel';
import { Student, SchoolMenuService } from '@uni/core';
import { CartType } from '../../models/cart.model';
import { CurriculumManagementNode } from '../../models/curriculum-manager.model';
import { CurriculumManagerService } from '../../services/curriculum-manager.service';
import { CurriculumFlowPurchaseComponent, CurriculumFlowSwapComponent } from '../curriculum-flows/curriculum-flows';
import { Subscription, Observable } from 'rxjs';
import { filter, map, distinctUntilChanged, tap, mergeMap } from 'rxjs/operators';

type CurriculumAction = CartType;

@Component({
  selector: 'curriculum-manager',
  templateUrl: './curriculum-manager.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: CurriculumManagerService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurriculumManagerComponent implements OnInit, AfterViewInit, OnDestroy {

  curriculumManagementNodes: CurriculumManagementNode[] = [];

  // tslint:disable: variable-name
  private _currentStudentId: string;
  private _componentSubscription = new Subscription();

  @Input() student$: Observable<Student>;
  @Input() actionCallbacks: { [name: string]: (context?: CurriculumManagementNode) => any };
  @ViewChild(NgxExcelComponent, { static: false }) protected excelComponent: NgxExcelComponent;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected message: NzMessageService,
    protected drawer: NzDrawerService,
    protected modal: NzModalService,
    protected schoolMenuService: SchoolMenuService,
    protected curriculumManagerService: CurriculumManagerService
  ) { }

  ngOnInit() { }

  ngAfterViewInit() {
    if (!this.excelComponent) { return; }
    const reloadSubscription = this.student$.pipe(
      filter((student) => !!student),
      map((student) => student.id),
      distinctUntilChanged(),
      tap(() => this.message.loading('数据加载中，请稍候...', { nzDuration: 0 })),
      map((studentId) => {
        this._currentStudentId = studentId;
        return { studentId, schoolId: this.schoolMenuService.currentSchool.id || '' };
      }),
      mergeMap((filters) => this.curriculumManagerService.getCurriculumManagementNodes(filters))
    ).subscribe((curriculumManagementNodes) => {
      this.message.remove();
      this.curriculumManagementNodes.push(...curriculumManagementNodes);
      this.excelComponent.reload();
    }, (e) => {
      this.message.remove();
      this.message.error(e.message || '系统错误，请联系管理员');
    });
    this._componentSubscription.add(reloadSubscription);
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  /**
   * 当动作按钮被点击时执行
   * @param e 事件
   * @param action 动作名
   * @param context 上下文节点模型
   */
  handleActionButtonClick(e: Event, action: CurriculumAction, context?: CurriculumManagementNode) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const callback = this._getActionCallback(action);
    let successMessage: string;
    let options: NzDrawerOptions;
    switch (action) {
      case 'new-purchase':
      case 'continuous-purchase':
        successMessage = '购课成功';
        options = {
          nzWidth: 1080,
          nzBodyStyle: { padding: '0' },
          nzContent: CurriculumFlowPurchaseComponent,
          nzContentParams: {
            student$: this.student$,
            cartType: action
          }
        };
        break;
      // case 'non-etp-exchange':
      // case 'etp-exchange':
      // case 'etp-translation':
        // break;
      case 'swap':
        successMessage = '课时 / 课号调整成功';
        options = {
          nzWidth: 720,
          nzContent: CurriculumFlowSwapComponent,
          nzContentParams: {
            student$: this.student$,
            cartType: action,
            currentProduct: context.relativeProduct,
            currentSubject: context.relativeSubject
          }
        };
        break;
      default:
        this.message.error('无法支持该学员课程管理操作');
        return;
    }

    const actionButtonStream: Observable<boolean> = callback ? callback(context) : this.drawer.create(options).afterClose;
    actionButtonStream.pipe(
      mergeMap((reloadSignal) => {
        if (!reloadSignal) { return []; }
        const filters = {
          studentId: this._currentStudentId,
          schoolId: this.schoolMenuService.currentSchool.id || ''
        };
        return this.curriculumManagerService.getCurriculumManagementNodes(filters);
      })
    ).subscribe((curriculumManagementNodes) => {
      if (curriculumManagementNodes.length === 0) { return; }
      this.message.success(successMessage);
      this.curriculumManagementNodes.splice(0, this.curriculumManagementNodes.length, ...curriculumManagementNodes);
      this.excelComponent.reload();
    }, ({ message }) => {
      this.message.error(message || '系统错误，请联系管理员');
    });
  }

  handleTeacherColumnClick = (context) => {
    console.log(context);
  }

  /**
   * 当调整课时 / 课号菜单被点击时执行
   */
  handleSwapMenuClick = ({ context }: { context: CurriculumManagementNode }) => {
    this.handleActionButtonClick(null, 'swap', context);
  }

  /**
   * 获得指定动作的回调函数
   * swap: (context: CurriculumManagementNode) => Observable<boolean>
   * @param action 动作
   */
  private _getActionCallback(action: string) {
    if (!this.actionCallbacks) { return null; }
    return this.actionCallbacks[action] || null;
  }

}
