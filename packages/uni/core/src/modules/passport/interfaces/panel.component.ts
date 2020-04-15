import { Inject, HostBinding, Output, EventEmitter, OnInit } from '@angular/core';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { BACKEND_ROOT, BackendComponent } from '../../../backend.component';

export const animationPassportPanel = trigger('animation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'perspective(400px) rotateX(90deg)' }),
    animate('0.5s 0.3s ease-in', keyframes([
      style({ opacity: 0, transform: 'perspective(400px) rotateX(90deg)', offset: 0 }),
      style({ transform: 'perspective(400px) rotateX(-20deg)', offset: 0.4 }),
      style({ opacity: 1, transform: 'perspective(400px) rotateX(10deg)', offset: 0.6 }),
      style({ transform: 'perspective(400px) rotateX(-5deg)', offset: 0.8 }),
      style({ transform: 'perspective(400px)', offset: 1 })
    ]))
  ]),
  transition(':leave', [
    style({ transform: 'perspective(400px)' }),
    animate('0.3s ease-in', keyframes([
      style({ transform: 'perspective(400px)', offset: 0 }),
      style({ opacity: 0, transform: 'perspective(400px) rotateX(90deg)', offset: 1 })
    ]))
  ])
]);

export abstract class IBackendPassportPanelComponent implements OnInit {

  @HostBinding('@animation') authPanelAnimation = null;
  @Output() panelToggle: EventEmitter<{ name: string, data?: any }> = new EventEmitter();

  constructor(
    title: string,
    @Inject(BACKEND_ROOT) protected root: BackendComponent
  ) {
    root.setTitle(title);
  }

  ngOnInit() {
  }

  navigateTo(name: string, data?: any) {
    this.panelToggle.emit({ name, data });
  }

}
