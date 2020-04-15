import {Student, ProductCurriculum, ProductSubject, Product} from '@uni/core';

export interface FailureDetail  {
  id: string;
  coursesNumber: string;
  type: string;
  time: string;
  reason: string;
  createdAt: string;
  updatedAt: string;
  student: Student;
  curriculum: ProductCurriculum;
  subject?: ProductSubject;
  product?: Product;
}
