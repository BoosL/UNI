import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { EChartOption, ECharts } from 'echarts';
import { SoCustomerStatsService } from '../../../services/so-customer-stats.service';
import { forkJoin, Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isArray } from 'util';
import { utc } from 'moment';

@Component({
  selector: 'so-dashboard',
  templateUrl: './so-dashboard.component.html',
  providers: [
    SoCustomerStatsService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoDashboardComponent implements OnInit {

  dictionary$: Observable<{ [name: string]: string | number }>;

  options: EChartOption;

  // tslint:disable: variable-name
  private _dictionarySubject = new BehaviorSubject<{ [name: string]: string | number }>({});
  private _echartDefaultOptions: EChartOption;
  private _echartObject: ECharts;

  constructor(
    protected message: NzMessageService,
    protected statsService: SoCustomerStatsService
  ) { }

  ngOnInit() {
    this._echartDefaultOptions = {
      tooltip: { trigger: 'axis' },
      legend: { data: ['新增客户', '签约客户', '有效客户', '到访客户'] },
      xAxis: { type: 'category', boundaryGap: false },
      yAxis: { type: 'value', minInterval: 1 },
      series: [
        { name: '新增客户', type: 'line', stack: '总量', data: [] },
        { name: '签约客户', type: 'line', stack: '总量', data: [] },
        { name: '有效客户', type: 'line', stack: '总量', data: [] },
        { name: '到访客户', type: 'line', stack: '总量', data: [] }
      ]
    };
    this.options = Object.assign({}, this._echartDefaultOptions);
    this.dictionary$ = this._dictionarySubject.asObservable();
  }

  /**
   * 图表初始化完成后执行
   * @param echart 图表对象
   */
  handleChartInit(echart: ECharts) {
    this._echartObject = echart;
    this.message.loading('数据加载中，请稍候...', { nzDuration: 0 });
    forkJoin(this.statsService.reload({ dim: 'daily' }), this.statsService.reload({ dim: 'monthly' })).pipe(
      tap((resultSet) => {
        if (resultSet[0] && isArray(resultSet[0]) && resultSet[0].length > 0) {
          this._rebuildChart(resultSet[0]);
        }
        if (resultSet[1] && isArray(resultSet[1]) && resultSet[1].length > 0) {
          const dictionary = resultSet[1][resultSet[1].length - 1];
          this._dictionarySubject.next(dictionary);
        }
      })
    ).subscribe(() => {
      this.message.remove();
    }, (e) => {
      this.message.remove();
      this.message.error(e.message || '系统错误，请联系管理员！');
    });
  }

  /**
   * 重新渲染图表
   * @param data 待渲染的数据
   */
  private _rebuildChart(data: Array<{ [name: string]: string | number }>) {
    if (!this._echartObject) { return; }
    const dataOptions = {
      xAxis: { data: [] },
      series: [
        { name: '新增客户', type: 'line', stack: '新增客户', data: [] },
        { name: '签约客户', type: 'line', stack: '签约客户', data: [] },
        { name: '有效客户', type: 'line', stack: '有效客户', data: [] },
        { name: '到访客户', type: 'line', stack: '到访客户', data: [] }
      ]
    };
    data.sort((o1, o2) => {
      if (o1.day === o2.day) { return 0; }
      return o1.day > o2.day ? 1 : -1;
    }).forEach((o) => {
      const objectDate = utc(o.day + ' +0800', 'YYYY-MM-DD Z');
      if (!objectDate.isValid()) { return; }
      dataOptions.xAxis.data.push(objectDate.local().format('DD 日'));
      dataOptions.series[0].data.push(o.new_customers_count);
      dataOptions.series[1].data.push(o.signed_customers_count);
      dataOptions.series[2].data.push(o.valid_customers_count);
      dataOptions.series[3].data.push(o.visited_customers_count);
    });
    console.log(dataOptions);

    this._echartObject.setOption(Object.assign({}, this._echartDefaultOptions, dataOptions));
  }

}
