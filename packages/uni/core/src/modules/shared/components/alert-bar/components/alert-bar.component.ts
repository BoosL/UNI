import { Component, OnInit, Input, ContentChild, TemplateRef, HostBinding, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate, AnimationEvent } from '@angular/animations';
import { AlertBarBodyDirective } from '../directives/alert-bar-body.directive';
import { PreferencesService } from '../../../services/preferences.service';

export type AlertBarType = 'info' | 'success' | 'danger' | 'warning';

@Component({
  selector: 'alert-bar',
  templateUrl: './alert-bar.component.html',
  animations: [
    trigger('visible', [
      state('*', style({ opacity: 1, height: '*' })),
      state('false', style({ opacity: 0, height: '0' })),
      transition('* => false', animate('200ms ease'))
    ])
  ]
})
export class AlertBarComponent implements OnInit {

  isVisible: boolean;
  visibleState = true;
  classes: { [name: string]: boolean } = { 'alert-info': false, 'alert-success': false, 'alert-danger': false, 'alert-warning': false };

  @Input() name: string;
  @Input() icon: string;
  @Input() type: AlertBarType;
  @Input() message: string;
  @Output() messageChange = new EventEmitter<string>();

  @ContentChild(AlertBarBodyDirective, { read: TemplateRef, static: false }) alertBarBodyTpl: TemplateRef<any>;

  context = {
    close: () => this._close()
  };

  constructor(
    protected preferences: PreferencesService
  ) { }

  ngOnInit() {
    if (this.name) {
      this.isVisible = !this.preferences.get(`AlertBarInvisible.${this.name}`, false);
    } else {
      this.isVisible = true;
    }
    if (this.type) {
      this.classes[`alert-${this.type}`] = true;
    } else {
      this.classes['alert-info'] = true;
    }
  }

  handleVisibleAnimationDone(e: AnimationEvent) {
    if (this.visibleState) { return; }
    if (this.name) {
      this.preferences.set(`AlertBarInvisible.${this.name}`, !this.visibleState);
    }
    this.isVisible = this.visibleState;
    this.messageChange.emit('');
  }

  private _close() {
    this.visibleState = false;
  }

}
