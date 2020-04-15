import { OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

export abstract class BaseCustomerStatsComponent implements OnInit, OnDestroy {

  dictionary: { [name: string]: string | number } = {};

  protected allowDictionaryNames: string[] = [];

  // tslint:disable-next-line: variable-name
  private _componentSubscription = new Subscription();

  constructor(
    protected cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const dictionarySubscription = this.getDictionaryStream().subscribe((dictionary) => {
      this.dictionary = dictionary;
      this.cdr.detectChanges();
    });
    this._componentSubscription.add(dictionarySubscription);
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  num(name: string) {
    return (this.allowDictionaryNames.indexOf(name) < 0 || this.dictionary[name] === undefined) ? '-' : `${this.dictionary[name]}`;
  }

  /**
   * 获得统计数据的提取流
   */
  protected abstract getDictionaryStream(): Observable<any>;

}
