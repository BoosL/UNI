import { Component, OnInit, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

declare let Stats: any;

@Component({
  selector: 'chrome-stats',
  template: ``
})

export class ChromeStatsComponent implements OnInit, AfterViewInit {

  constructor(
    protected el: ElementRef,
    protected renderer2: Renderer2
  ) { }

  ngOnInit() { }

  protected numDomNodes(node: HTMLElement) {
    if (!node.children || node.children.length === 0) {
      return 0;
    }
    const childrenCount = Array.from(node.children).map(this.numDomNodes);
    return node.children.length + childrenCount.reduce((p: number, c: number) => p + c, 0);
  }

  ngAfterViewInit() {
    /*const stats = new Stats();
    const domPanel = new Stats.Panel('DOM Nodes', '#0ff', '#002');
    stats.addPanel(domPanel);
    stats.showPanel(3);
    this.renderer2.setStyle(stats.dom, 'position', 'relative');
    this.renderer2.appendChild(this.el.nativeElement, stats.dom);

    function numDomNodes(node: HTMLElement) {
        if (!node.children || node.children.length === 0) {
            return 0;
        }
        const childrenCount = Array.from(node.children).map(numDomNodes);
        return node.children.length + childrenCount.reduce(function(p, c) { return p + c; }, 0);
    }

    setTimeout(function timeoutFunc() {
        domPanel.update(numDomNodes(document.body), 1500);
        setTimeout(timeoutFunc, 100);
    }, 100);*/
    const stats = new Stats();
    const domPanel = new Stats.Panel('DOM Nodes', '#0ff', '#002');
    stats.addPanel(domPanel);
    stats.showPanel(3);
    this.renderer2.setStyle(stats.dom, 'position', 'relative');
    this.renderer2.appendChild(this.el.nativeElement, stats.dom);

    function getDomCount(el: HTMLElement) {
      if (!el.children || el.children.length === 0) { return 0; }
      const childrenCount = Array.from(el.children).map(getDomCount);
      return el.children.length + childrenCount.reduce((p: number, c: number) => p + c, 0);
    }

    function animate() {
      stats.begin();
      domPanel.update(getDomCount(document.body), 1500);
      stats.end();

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

}
