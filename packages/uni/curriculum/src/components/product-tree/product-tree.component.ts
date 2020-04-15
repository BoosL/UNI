import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { NzTreeNode, NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd';

@Component({
  selector: 'product-tree',
  templateUrl: './product-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductTreeComponent implements OnInit {

  @Input() nodes$: Observable<NzTreeNode[]>;
  @Input() onExpandCallback: (node: NzTreeNode) => Observable<NzTreeNode[]>;
  @Output() nodeSelect = new EventEmitter<NzTreeNode>();

  constructor() { }

  ngOnInit() {
  }

  nzEvent(e: Required<NzFormatEmitEvent>) {
    const node = e.node;
    if (!node) { return; }

    if (e.eventName === 'click' && node.isLeaf) {
      this.nodeSelect.emit(node);
      return;
    }

    if (e.eventName === 'click') {
      node.isExpanded = !node.isExpanded;
      node.isLoading = node.isExpanded && node.children.length === 0;
    } else if (e.eventName === 'expand') {
      node.isSelected = node.isExpanded;
    }
    if (
      (e.eventName === 'expand' || e.eventName === 'click') &&
      node.children.length === 0 && node.isExpanded &&
      this.onExpandCallback
    ) {
      this.onExpandCallback(node).subscribe(
        (children) => node.addChildren(children)
      );
    }
  }

}
