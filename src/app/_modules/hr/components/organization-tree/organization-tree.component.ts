import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd';
import { HrOrganization } from '../../models/hr-organization.model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'organization-tree',
  templateUrl: './organization-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationTreeComponent implements OnInit {

  nodes$: Observable<NzTreeNodeOptions[]>;

  @Input() organizations$: Observable<HrOrganization[]>;
  @Input() onExpandCallback: (organization: HrOrganization) => Observable<HrOrganization[]>;
  @Output() nodeSelect = new EventEmitter<HrOrganization>();

  constructor(
    protected cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.nodes$ = this.organizations$ ? this.organizations$.pipe(
      map((organizations) => organizations && this._organizations2TreeNodes(organizations))
    ) : of([]);
  }

  /**
   * 当树节点被展开或者点击时执行
   * @param e 事件
   */
  nzEvent(e: Required<NzFormatEmitEvent>) {
    const node = e.node;
    if (!node) { return; }

    if (e.eventName === 'click' && node.isLeaf) {
      this.nodeSelect.emit(node.origin.payload);
      return;
    }

    if (e.eventName === 'click') {
      node.isExpanded = !node.isExpanded;
      if (node.isExpanded) {
        this.nodeSelect.emit(node.origin.payload);
      }
    } else if (e.eventName === 'expand') {
      node.isSelected = node.isExpanded;
    }
    if (
      (e.eventName === 'expand' || e.eventName === 'click') &&
      node.children.length === 0 && node.isExpanded &&
      this.onExpandCallback
    ) {
      this.onExpandCallback(node.origin.payload).subscribe(
        (children) => node.addChildren(this._organizations2TreeNodes(children, node.origin.payload))
      );
    }
  }

  /**
   * 将组织转化为树结构
   * @param organizations 组织模型
   * @param parent 父组织模型
   */
  private _organizations2TreeNodes(organizations: HrOrganization[], parent?: HrOrganization): NzTreeNodeOptions[] {
    const parentId = parent ? parent.id : '';
    const nodes: NzTreeNodeOptions[] = [];
    organizations.filter((organization) => organization.parentId === parentId).forEach((organization) => {
      const node = { key: organization.id, title: organization.nameShort, payload: organization } as NzTreeNodeOptions;
      const children = this._organizations2TreeNodes(organizations, organization);
      if (children.length > 0) {
        node.children = [...children];
        node.expanded = true;
      } else if (!organization.hasChildren) {
        node.isLeaf = true;
      }
      nodes.push(node);
    });
    return nodes;
  }

}
