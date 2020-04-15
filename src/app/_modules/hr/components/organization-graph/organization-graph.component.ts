import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Edge, Node } from '@swimlane/ngx-graph';
import { Organization } from '@uni/core';
import { DagreNodesOnlyLayout, DagreSettings, Orientation } from './dagre-nodes-only';
import { Observable, Subject } from 'rxjs';
import * as shape from 'd3-shape';

@Component({
  selector: 'organization-graph',
  templateUrl: './organization-graph.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationGraphComponent implements OnInit {

  lines: Edge[];
  nodes: Node[];
  curve = shape.curveLinear;
  layout = new DagreNodesOnlyLayout();
  layoutSettings: DagreSettings = {
    orientation: Orientation.LEFT_TO_RIGHT
  };
  update$: Observable<boolean>;
  center$: Observable<boolean>;

  // tslint:disable: variable-name
  private _dataUpdateSubject = new Subject<boolean>();
  private _graphCenterSubject = new Subject<boolean>();

  @Input() organization$: Observable<Organization[]>;
  @Input() onExpandCallback: (organization?: Organization) => Observable<Organization[]>;

  constructor() { }

  ngOnInit() {
    this.update$ = this._dataUpdateSubject.asObservable();
    this.center$ = this._graphCenterSubject.asObservable();
    /*this.lines = [];
    this.nodes = [];*/
    this._reload();
    /*
    this.organization$.subscribe((x) => console.log(x));
    this.lines = [
      { id: 'a', source: 'first', target: 'second', label: 'is parent of' },
      { id: 'b', source: 'first', target: 'third', label: 'custom label' }
    ];

    this.nodes = [
      { id: 'first', label: 'A' },
      { id: 'second', label: 'B' },
      { id: 'third', label: 'C' }
    ]; */
  }

  handleExpandIconClick(node: Node, direction?: 'left' | 'right') {
    console.log(node);
    this.onExpandCallback(node.data).subscribe((organizations) => {
      organizations.forEach((organization) => this._resolveOrganization(organization));
      this._dataUpdateSubject.next(true);
    });
  }

  private _reload() {
    if (!this.onExpandCallback) { return; }
    this.lines = [];
    this.nodes = [];
    this.onExpandCallback().subscribe((organizations) => {
      organizations.forEach((organization) => this._resolveOrganization(organization));
      this._dataUpdateSubject.next(true);
      this._graphCenterSubject.next(true);
    });
    /* this.organization$.subscribe((organizations) => {
      organizations.forEach((organization) => {
        const node: Node = {
          id: 'n-' + organization.idPath,
          label: organization.nameShort,
          data: organization
        };
        this.nodes.push(node);
        if (!organization.parentId || organization.idPath.indexOf('-') <= 0) { return; }
        const idPathParts = organization.idPath.split('-');
        console.log(idPathParts);
        if (
          idPathParts[idPathParts.length - 2] !== organization.parentId ||
          idPathParts[idPathParts.length - 1] !== organization.id
        ) { return; }

        const line: Edge = {
          id: 'l-' + organization.id + '-' + organization.parentId,
          source: 'n-' + idPathParts.slice(0, -1).join('-'),
          target: 'n-' + organization.idPath
        };
        this.lines.push(line);
      });
      this._dataUpdateSubject.next(true);
    }); */
  }

  private _resolveOrganization(organization: Organization, parentOrganization?: Organization) {
    const node: Node = {
      id: 'n-' + organization.idPath,
      label: organization.nameShort,
      data: organization
    };
    this.nodes.push(node);
    if (!organization.parentId || organization.idPath.indexOf('-') <= 0) { return; }
    const idPathParts = organization.idPath.split('-');
    console.log(idPathParts);
    if (
      idPathParts[idPathParts.length - 2] !== organization.parentId ||
      idPathParts[idPathParts.length - 1] !== organization.id
    ) { return; }

    const line: Edge = {
      id: 'l-' + organization.id + '-' + organization.parentId,
      source: 'n-' + idPathParts.slice(0, -1).join('-'),
      target: 'n-' + organization.idPath
    };
    this.lines.push(line);
  }

}
