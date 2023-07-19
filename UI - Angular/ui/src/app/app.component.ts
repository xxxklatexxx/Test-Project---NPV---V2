import { OnInit, AfterViewInit, Component } from '@angular/core';
import * as Chartist from 'chartist';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'ui';

  lowerBoundRate: number = 1.00;
  upperBoundRate: number = 15.00
  discountRateIncrement: number = 0.25;

  constructor() {}
  
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    var chart = new Chartist.LineChart(
      '.ct-chart',
      {
        labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        series: [[50, 40, 300, 320, 500, 350, 200, 230, 500]],
      },
      {
        fullWidth: false,
        chartPadding: {
          right: 40,
          left: 40,
        },
        showGridBackground: false
      }
    );

    chart.on('draw', (data) => {
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
}
