import { Component, OnInit, Inject } from '@angular/core';
import { BACKEND_CONFIG, IBackendConfig } from '../../../../backend.config';
import { UploadFile } from '../../../../models/models';
import { QuickLinksService } from '../../services/quick-links.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'quick-links',
  templateUrl: './quick-links.component.html'
})

export class QuickLinksComponent implements OnInit {

  documents$: Observable<UploadFile[]>;

  constructor(
    protected quickLinksService: QuickLinksService,
    @Inject(BACKEND_CONFIG) public appConfig: IBackendConfig,
  ) { }

  ngOnInit() {
    const payload = { module: this.appConfig.moduleName };
    this.documents$ = this.quickLinksService.getList(payload);
  }

  handlePlaceholderClicked(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    /* this.snackBar.open('噢！这里发生了一些不好的事情', '关闭', {
      duration: 2000
    }); */
  }
}
