import {
  Component,
  ChangeDetectionStrategy,
  Input,
  AfterViewInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import {
  INgxExcelDataSource,
  NgxExcelComponent,
} from 'ngx-excel';
import { Observable, Subscription } from 'rxjs';
import { StudentsPrimaryClass, StudentPrimaryProduct } from '@uni/student';
import { StudentPrimaryClassProductDataService } from './student-primary-class-product-data.service';

@Component({
  selector: 'student-primary-class-product',
  templateUrl: './student-primary-class-product.component.html',
  providers: [
    StudentPrimaryClassProductDataService,
    { provide: INgxExcelDataSource, useExisting: StudentPrimaryClassProductDataService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentPrimaryClassProductComponent implements AfterViewInit, OnDestroy {
  products: StudentPrimaryProduct[] = [];
  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();

  @Input() student$: Observable<StudentsPrimaryClass>;
  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

  constructor(
    protected excel: StudentPrimaryClassProductDataService
  ) { }

  ngAfterViewInit(): void {
    this._componentSubscription.add(this.student$.subscribe(
      (primaryClass) => {
        if (primaryClass && primaryClass.products && primaryClass.products.length > 0) {
          primaryClass.products.forEach( (item) => this.products.push(item));
          this.excelComponent.reload();
        }
      })
    );
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }
}
