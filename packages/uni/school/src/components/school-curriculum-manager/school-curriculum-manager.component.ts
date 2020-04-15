import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import {
  School,
  ProductService,
  ProductSubjectService,
  ProductCurriculumService,
  SchoolAvailableProductService,
  SchoolAvailableSubjectService,
  SchoolAvailableCurriculumService
} from '@uni/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'school-curriculum-manager',
  templateUrl: './school-curriculum-manager.component.html',
  providers: [
    { provide: ProductService, useExisting: SchoolAvailableProductService },
    { provide: ProductSubjectService, useExisting: SchoolAvailableSubjectService },
    { provide: ProductCurriculumService, useExisting: SchoolAvailableCurriculumService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchoolCurriculumManagerComponent implements OnInit {

  extraFilters$: Observable<{ [name: string]: string | string[] }>;

  @Input() school$: Observable<School>;

  constructor() { }

  ngOnInit() {
    this.extraFilters$ = this.school$.pipe(
      filter((school) => !!school),
      map((school) => ({ schoolId: school.id }))
    );
  }
}

