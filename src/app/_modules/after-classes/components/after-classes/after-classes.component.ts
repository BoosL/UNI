import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Renderer2,
  Injector,
  ComponentFactoryResolver,
  forwardRef,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {INgxExcelDataSource, NgxExcelComponentService} from 'ngx-excel';
import {
  IBackendPageComponent,
  BACKEND_PAGE,
} from '@uni/core';
import {NzDrawerService} from 'ng-zorro-antd';
import {AfterClassesService} from '../../_services/after-classes.service';
import {AfterClassesComponentService} from '../../services/after-classes-component.service';

@Component({
  selector: 'backend-page.after-classes',
  templateUrl: './after-classes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: BACKEND_PAGE, useExisting: forwardRef(() => AfterClassesComponent) },
    { provide: INgxExcelDataSource, useExisting: AfterClassesService },
    { provide: NgxExcelComponentService, useClass: AfterClassesComponentService }
  ]
})
export class AfterClassesComponent extends IBackendPageComponent implements OnInit {


  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected renderer2: Renderer2,
    protected injector: Injector,
    protected cfr: ComponentFactoryResolver,
    protected excel: AfterClassesService,
    protected drawer: NzDrawerService,
  ) {
    super(renderer2, injector, cfr);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
