export interface Organization {
  id: string;
  name: string;
  nameShort: string;
  idPath: string;
  parentId: string;
}

export interface Position {
  id: string;
  name: string;
  type: string;
}

export interface OrganizationPosition {
  id: string;
  organization: Organization;
  position: Position;
}
