import { OnInit, AfterViewInit, Component } from '@angular/core';
import * as Chartist from 'chartist';
import { Subject, lastValueFrom, map } from 'rxjs';
import { NpvServiceService } from './services/npv-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'ui';

  lowerBoundRate: number = 1.0;
  upperBoundRate: number = 5.0;
  discountRateIncrement: number = 0.25;

  cashFlows: number[] = [1000, 100, 200, 300, 400, 500];

  chart!: Chartist.LineChart;

  result: { npv: number; rate: number }[] = [];
  constructor(private service: NpvServiceService) {}

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  ngOnInit(): void {
    this.calculateNpv();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(this.dtOptions);

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
    this.cashFlows.push(0);
  }

  RemoveCashFlow() {
    this.cashFlows.splice(this.cashFlows.length - 1, 1);
  }

  calculateNpv() {
    this.service
      .postData({
        upper: this.upperBoundRate,
        lower: this.lowerBoundRate,
        rateIncrement: this.discountRateIncrement,
        cashFlows: this.cashFlows,
      })
      .subscribe({
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
}
