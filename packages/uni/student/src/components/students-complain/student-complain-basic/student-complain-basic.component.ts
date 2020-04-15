import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import {
  NgxExcelModelColumnRules,
  INgxExcelDataSource
} from 'ngx-excel';
import { Observable } from 'rxjs';
import { StudentComplain } from '../../../models/student-complain.model';
import { StudentComplainService } from '../../../service/students-complain/students-complain.service';

@Component({
  selector: 'student-complain-basic',
  templateUrl: './student-complain-basic.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: StudentComplainService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentComplainBasicComponent implements OnInit {

  studnetId: string;

  rules: NgxExcelModelColumnRules<StudentComplain>;
  @Input() student$: Observable<StudentComplain>;

  constructor(
    protected studentComplainService: StudentComplainService
  ) { }

  ngOnInit() {
    this.rules = this.studentComplainService.getRules();
    this.rules.state.label = '投诉状态';
  }

}
