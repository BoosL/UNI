import {
  Component,
  Input,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { Student } from '@uni/core';
import { Observable } from 'rxjs';


@Component({
  selector: 'student-follows',
  templateUrl: './student-follows.component.html',
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentFollowsComponent implements OnInit, AfterViewInit {


  @Input() student$: Observable<Student>;

  constructor() { }

  ngOnInit() { }


  ngAfterViewInit() { }

}
