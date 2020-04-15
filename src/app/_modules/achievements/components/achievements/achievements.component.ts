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
import { INgxExcelDataSource} from 'ngx-excel';
import {
  IBackendPageComponent,
  BACKEND_PAGE,
} from '@uni/core';
import {AchievementsService} from '../../_services/achievements.service';
import {NzDrawerService} from 'ng-zorro-antd';
import {AchievementModel} from '../../model/achievement.model';
import {AchievementComponent} from '../achievement/achievement.component';

@Component({
  selector: 'backend-page.achievements',
  templateUrl: './achievements.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: BACKEND_PAGE, useExisting: forwardRef(() => AchievementsComponent) },
    { provide: INgxExcelDataSource, useExisting: AchievementsService },
  ]
})
export class AchievementsComponent extends IBackendPageComponent implements OnInit {


  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected renderer2: Renderer2,
    protected injector: Injector,
    protected cfr: ComponentFactoryResolver,
    protected excel: AchievementsService,
    protected drawer: NzDrawerService,
  ) {
    super(renderer2, injector, cfr);
  }

  ngOnInit() { }
  view = ({context}) => {
      this.excel.getModel(context.id).subscribe((result: AchievementModel) => {
        const drawerRef = this.drawer.create({
          nzWidth: '45%',
          nzBodyStyle: { height: '100%', overflow: 'auto', padding: '0 0 54px 0' },
          nzContent: AchievementComponent,
          nzContentParams: {
            achievement: result,
          }
        });
      });
  }
}
