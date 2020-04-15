import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { NzModalRef, NzTreeNode, NzFormatEmitEvent, NzMessageService } from 'ng-zorro-antd';
import { CustomerSource } from '@uni/core';
import { TmkEmployeeConfig } from '../../models/tmk-employee.model';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { TmkEmployeeConfigService } from '../../services/tmk-employee-config.service';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'tmk-employee-sources-manager',
  templateUrl: './tmk-employee-sources-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmkEmployeeSourcesManagerComponent implements OnInit {

  searchKeyword: string;
  searching: boolean;
  nzSearchValue: string;
  selectedEmployeeSources: CustomerSource[];
  nodes$: Observable<NzTreeNode[]>;

  // tslint:disable: variable-name
  private _availableEmployeeSourcesSubject = new BehaviorSubject<NzTreeNode[]>(null);
  private _searchSubject = new BehaviorSubject<string>('');
  private _componentSubscription = new Subscription();

  @Input() employeeConfig: TmkEmployeeConfig;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected message: NzMessageService,
    protected modalRef: NzModalRef,
    protected employeeConfigService: TmkEmployeeConfigService
  ) { }

  ngOnInit() {
    this.employeeConfig = this.employeeConfig || this.employeeConfigService.createModel();
    this.selectedEmployeeSources = [...this.employeeConfig.relativeSources];
    this.nodes$ = this._availableEmployeeSourcesSubject.asObservable();

    const searchSubscription = this._searchSubject.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((keyword) => this.employeeConfigService.getAvailableSourcesForeignModels(this.employeeConfig, keyword)),
      map((sources) => this._transformSourcesToNodes(sources))
    ).subscribe(
      (availableEmployeeSources) => {
        this._availableEmployeeSourcesSubject.next(availableEmployeeSources as NzTreeNode[]);
        this.nzSearchValue = this.searchKeyword;
      },
      (e) => {
        this.message.error(e.message || '无法获得员工可用的TMK渠道标签');
        this._availableEmployeeSourcesSubject.next([]);
      }
    );
    this._componentSubscription.add(searchSubscription);
  }

  handleSearchChange(_: Event) {
    this._searchSubject.next(this.searchKeyword);
  }

  handleTreeEvent(e: Required<NzFormatEmitEvent>) {
    const node = e.node;
    if (!node) { return; }

    if (e.eventName === 'click' && node.isLeaf) {
      node.isSelected = true;
      // this.nodeSelect.emit(node);
      // this.appendEmployeeSource({ id: node.key, name: node.title } as CustomerSource);
      return;
    }

    if (e.eventName === 'click') {
      node.isExpanded = !node.isExpanded;
      node.isLoading = node.isExpanded && node.children.length === 0;
      // this.appendEmployeeSource({ id: node.key, name: node.title } as CustomerSource);
    } else if (e.eventName === 'expand') {
      node.isSelected = node.isExpanded;
    }
    if (
      (e.eventName === 'expand' || e.eventName === 'click') &&
      node.children.length === 0 && node.isExpanded
    ) {
      this.employeeConfigService.getAvailableSourcesForeignModelsByParentId(this.employeeConfig, node.key).pipe(
        map((sources) => this._transformSourcesToNodes(sources))
      ).subscribe((children) => node.addChildren(children));
    }
  }

  handleTreeClick(node: NzTreeNode) {
    this.appendEmployeeSource({ id: node.key, name: node.title } as CustomerSource);
  }

  /**
   * 追加渠道标签
   * @param employeeSource 待追加的渠道标签
   */
  appendEmployeeSource(employeeSource: CustomerSource) {
    if (!employeeSource) { return; }
    const matchedEmployeeSource = this.selectedEmployeeSources.find((selectedEmployeeSource) => {
      return selectedEmployeeSource.id === employeeSource.id;
    });
    if (matchedEmployeeSource) { return; }
    this.selectedEmployeeSources.push(employeeSource);
    this.cdr.detectChanges();
  }

  /**
   * 删除渠道标签
   * @param employeeSource 待删除的渠道标签
   */
  deleteEmployeeSource(employeeSource: CustomerSource) {
    if (!employeeSource) { return; }
    this.selectedEmployeeSources = this.selectedEmployeeSources.filter((selectedEmployeeSource) => {
      return selectedEmployeeSource.id !== employeeSource.id;
    });
    this.cdr.detectChanges();
  }

  close(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.modalRef.close();
  }

  confirm(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.modalRef.close(this.selectedEmployeeSources);
  }

  /**
   * 将渠道标签转化为树节点
   * @param sources 子渠道标签列表
   * @param parent 父渠道标签
   */
  private _transformSourcesToNodes(sources: CustomerSource[], parent: CustomerSource = null) {
    return sources.map((source) => {
      const node = { title: source.name, key: source.id };
      // tslint:disable: no-string-literal
      if (source.children === null) {
        node['isLeaf'] = true;
      } else {
        node['children'] = this._transformSourcesToNodes(source.children, source);
      }
      return node;
    });
  }

}
