import { SelectOption } from '../../models/models';
import { CurriculumPackage } from './curriculum-package.model';

export interface Product {
  id: string;
  name: string;
  type: SelectOption;
  level: SelectOption;
  curriculumCount: number;
  isPresented: boolean;
  isPackaged: boolean;
  description: string;
}

export interface ProductSubject {
  id: string;
  name: string;
  curriculumCount: number;
  description: string;
  relativeProduct: Product;
}

export interface ProductCurriculum {
  id: string;
  name: string;
  price: string;
  rank: number;
  description: string;
  remark: string;
  // relativePackage: CurriculumPackage;
  relativeSubject: ProductSubject;
  relativeProduct: Product;
}
