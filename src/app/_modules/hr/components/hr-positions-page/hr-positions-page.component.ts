import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  forwardRef,
  Renderer2,
  Injector,
  ComponentFactoryResolver,
  AfterViewInit,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs';
import { INgxExcelDataSource, NgxExcelComponent, NgxExcelComponentService } from 'ngx-excel';
import { IBackendPageComponent, BACKEND_PAGE } from '@uni/core';
import { NzDrawerService } from 'ng-zorro-antd';
import { filter, map } from 'rxjs/operators';
import { HrPositions  } from '../../models/hr-position.model';
import { HrPositionService } from '../../services/hr-positions.service';
import { HrPositionsEditComponent } from '../hr-positions-edit/hr-positions-edit.component';
import { HrPositionsPageComponentService } from './hr-positions-page-component.service';

@Component({
  selector: 'backend-page.positions',
  templateUrl: './hr-positions-page.component.html',
  providers: [
    { provide: BACKEND_PAGE, useExisting: forwardRef(() => HrPositionsPageComponent) },
    { provide: NgxExcelComponentService, useClass: HrPositionsPageComponentService },
    { provide: INgxExcelDataSource, useExisting: HrPositionService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HrPositionsPageComponent extends IBackendPageComponent implements OnInit, AfterViewInit, OnDestroy {

  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();

  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;


  constructor(
    protected renderer2: Renderer2,
    protected injector: Injector,
    protected cfr: ComponentFactoryResolver,
    protected drawer: NzDrawerService,
  ) {
    super(renderer2, injector, cfr);
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this._componentSubscription.add(
      this.excelComponent.bindFilters({}).reload()
    );
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }



   /**
    * 新增职务
    */
   addNewposition = ({ context }: { context: HrPositions }) => {
    const drawerRef = this.drawer.create<HrPositionsEditComponent, {
    }, HrPositions>({
      nzWidth: '45%',
      nzBodyStyle: { height: '100%', overflow: 'auto', padding: '0 0 54px 0' },
      nzContent: HrPositionsEditComponent,
      nzContentParams: {},
    });
    return drawerRef.afterClose.pipe(
      filter((studentAchievement) => !!studentAchievement),
      map((studentAchievement) => [{ action: 'append', contexts: studentAchievement }])
    );
  }

}
