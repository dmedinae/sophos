import { Component, OnInit, Input } from '@angular/core';
import { AmChartsService } from '@amcharts/amcharts3-angular';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css']
})
export class GraphsComponent implements OnInit {
  selectedChart = 3;
  @Input()
  data;
  @Input() title = '';
  chartType = [
    { value: 1, viewValue: 'Barras Verticales', icon: 'equalizer' },
    { value: 2, viewValue: 'Barras Horizontales', icon: 'view_headline' },
    { value: 3, viewValue: 'Torta', icon: 'pie_chart' },
    { value: 4, viewValue: 'Dona', icon: 'donut_large' }
  ];

  constructor(private AmCharts: AmChartsService) {}

  ngOnInit() {
    console.log(this.data);
    this.buildGraphics();
  }

  makeOptions(dataProvider) {
    const graphicsConfig = {
      type: 'pie',
      startDuration: 1,
      dataProvider: dataProvider,
      valueField: 'count',
      titleField: 'name',
      theme: 'light',
      export: {
        enabled: true
      },
      responsive: {
        enabled: true
      }
    };
    switch (this.selectedChart) {
      case 1:
        graphicsConfig.type = 'serial';
        graphicsConfig['categoryField'] = 'name';
        graphicsConfig['valueAxes'] = [
          {
            axisAlpha: 0,
            position: 'left'
          }
        ];
        graphicsConfig['graphs'] = [
          {
            fillAlphas: 0.9,
            lineAlpha: 0.2,
            type: 'column',
            valueField: 'count',
            autoColor: true
          }
        ];
        graphicsConfig['chartCursor'] = {
          categoryBalloonEnabled: false,
          cursorAlpha: 0,
          zoomable: false
        };
        graphicsConfig['categoryAxis'] = {
          gridPosition: 'start',
          labelRotation: 45
        };
        return graphicsConfig;
      case 2:
        graphicsConfig.type = 'serial';
        graphicsConfig['categoryField'] = 'name';
        graphicsConfig['rotate'] = true;
        graphicsConfig['categoryAxis'] = {
          gridPosition: 'start',
          position: 'left'
        };
        graphicsConfig['graphs'] = [
          {
            fillAlphas: 0.8,
            id: 'AmGraph-1',
            lineAlpha: 0.2,
            type: 'column',
            valueField: 'count',
            autoColor: true
          }
        ];
        graphicsConfig['valueAxes'] = [
          {
            id: 'ValueAxis-1',
            position: 'top',
            axisAlpha: 0
          }
        ];
        return graphicsConfig;
      case 3:
        graphicsConfig['legend'] = {
          marginRight: 100,
          autoMargins: false,
          markerType: 'circle',
          position: 'left',
          maxColumns: 1,
          valueAlign: 'left',
          markerLabelGap: 10,
          labelText: '[[title]]:'
        };
        return graphicsConfig;
      case 4:
        graphicsConfig['innerRadius'] = '50%';
        graphicsConfig['legend'] = {
          marginRight: 100,
          autoMargins: false,
          markerType: 'circle',
          position: 'left',
          maxColumns: 1,
          valueAlign: 'left',
          markerLabelGap: 10,
          labelText: '[[title]]:'
        };
        return graphicsConfig;
    }
  }

  buildGraphics() {
    const chart = this.AmCharts.makeChart(
      'chartdiv',
      this.makeOptions(this.data),
      0.01
    );
    if (chart.type === 'serial') {
      // check if there are graphs with autoColor: true set
      for (let i = 0; i < chart.graphs.length; i++) {
        const graph = chart.graphs[i];
        if (graph.autoColor !== true) {
          continue;
        }
        const colorKey = 'autoColor-' + i;
        graph.lineColorField = colorKey;
        graph.fillColorsField = colorKey;
        for (let x = 0; x < chart.dataProvider.length; x++) {
          const color = this.getRandomColor();
          chart.dataProvider[x][colorKey] = color;
        }
      }
    }
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  changeType(type) {
    console.log(type);
    this.selectedChart = type;
    this.buildGraphics();
  }
}
