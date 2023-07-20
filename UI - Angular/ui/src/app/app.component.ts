import { OnInit, AfterViewInit, Component } from '@angular/core';
import * as Chartist from 'chartist';
import { Subject } from 'rxjs';
import { NpvServiceService } from './services/npv-service.service';
import { RequestModel } from './models/request.model';
import { ResultModel } from './models/result.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'ui';

  request: RequestModel = {
    InitialInvestment: 10000,
    Lower: 1.0,
    Upper: 5.0,
    RateIncrement: 0.25,
    CashFlows: [2000, 3000, 4000, 5000, 6000],
  };

  cashFlows: number[] = [...this.request.CashFlows];
  chart!: Chartist.LineChart;

  result: ResultModel[] = [];

  constructor(private service: NpvServiceService) {}

  // dtOptions: DataTables.Settings = {};

  // dtTrigger: Subject<any> = new Subject();

  ngOnInit(): void {
    this.calculateNpv();
  }

  ngAfterViewInit(): void {
    // this.dtTrigger.next(this.dtOptions);

    this.chart.on('draw', (data) => {
      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 1000 * data.index,
            dur: 800,
            from: data.path
              .clone()
              .scale(1, 0)
              .translate(0, data.chartRect.height())
              .stringify(),
            to: data.path.clone().stringify(),
            easing: 'easeOutQuint',
          },
        });
      }
    });
  }

  AddCashFlow() {
    this.request.CashFlows.push(0);
    this.cashFlows.push(0);
  }

  RemoveCashFlow() {
    this.request.CashFlows.splice(this.request.CashFlows.length - 1, 1);
    this.cashFlows.splice(this.request.CashFlows.length - 1, 1);
  }

  calculateNpv() {
    this.service.postData(this.request).subscribe({
      next: (result) => {
        this.result = result;
        let labels = result.map((i) => i.rate);
        let series = result.map((i) => i.npv);
        this.chart = new Chartist.LineChart(
          '.ct-chart',
          {
            labels: labels,
            series: [series],
          },
          {
            fullWidth: false,
            chartPadding: {
              right: 40,
              left: 40,
            },
            showGridBackground: false,
          }
        );
      },
    });
  }

  updateCashFlow(event: Event, index: number) {
    this.request.CashFlows[index] = Number(
      (event.target as HTMLInputElement).value
    );
  }
}
