import { Component, ContentChild, OnInit, QueryList, SimpleChange, ViewChild, ViewChildren } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { BaseChartDirective, Color, Label } from 'ng2-charts';
import { AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { DatabaseServiceService, FullTimesheet } from '../database-service.service';

@Component({
  selector: 'app-account-summary',
  templateUrl: './account-summary.component.html',
  styleUrls: ['./account-summary.component.css']
})
export class AccountSummaryComponent implements OnInit {
  @ViewChildren( BaseChartDirective ) private charts!: QueryList<BaseChartDirective>;
  weekDays: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  localUUID: string = "";
  userDataList?: AngularFireList<FullTimesheet>;
  barData: number[] = [0, 0];
  lineData: number[] = [0, 0, 0, 0, 0, 0, 0];

  //Helper Functions
  formatTo(resultArr: number[], division: number): number[] {
    return resultArr.map(x => Math.round(((x/division) * 100)) / 100);
  }

  getWeekLabels(): Label[] {
    let today = new Date().getDay();
    let tmrw = (today + 1) % 7;
    let start = (today + 2) % 7;
    let labels: Label[] = [this.weekDays[tmrw]];
    for (let i = start; i != tmrw; i = (i+1)%7) {
      labels.push(this.weekDays[i]);
    }
    return labels;
  }

  getDateSplits(dataPoints: number, interval: number, lastEntry: Date): Date[] {
    let arr = []
    arr.push(lastEntry);
    for (let i = 1; i <= dataPoints; i++) {
      let newVal = new Date(lastEntry.getTime() - (interval * i));
      arr.push(newVal);
    }
    return arr.reverse();
  }

  updateChart() {
    let chartArray = this.charts.toArray();
    if (chartArray[0] && chartArray[0].chart.data && chartArray[0].chart.data.datasets) {
      chartArray[0].chart.data.datasets[0].data = this.barData;
      chartArray[0].chart.update();
    }
    if (chartArray[0] && chartArray[0].chart.data && chartArray[1].chart.data.datasets) {
      chartArray[1].chart.data.datasets[0].data = this.lineData;
      chartArray[1].chart.update();
    }
  }

  //Data Parsing
  saveUserData(): void {
    if (this.userDataList) {
      this.userDataList.valueChanges().subscribe((result)=> {
        this.generateData(result);
      })
    }
  }

  populateResult(dateSplits: Date[], resultArr: number[], startDate: Date, endDate: Date): void {
    let prevDate: Date = dateSplits[0];
    let curIndex = 0;
    for (let i = 1; i < dateSplits.length; i++) {
      if (startDate.getTime() <= prevDate.getTime()) {
        if (endDate.getTime() >= prevDate.getTime()) {
          if (endDate.getTime() < dateSplits[i].getTime()) {
            resultArr[curIndex] += endDate.getTime() - prevDate.getTime();
          } else {
            resultArr[curIndex] += dateSplits[i].getTime() - prevDate.getTime();
          }
        }
      } else if (startDate.getTime() <= dateSplits[i].getTime()) {
        if (endDate.getTime() <= dateSplits[i].getTime()) {
          resultArr[curIndex] += endDate.getTime() - startDate.getTime();
        } else {
          resultArr[curIndex] += dateSplits[i].getTime() - startDate.getTime();
        }
      }
      curIndex++;
      prevDate = dateSplits[i];
    }
  }

  generateData(data: FullTimesheet[]): void {
    let totalWorkTime: number = 0;
    let totalBreakTime: number = 0;
    let resultArr: number[] = new Array(7).fill(0);
    let dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() + 1);
    dateEnd.setHours(0, 0, 0, 0);
    
    data.forEach((item)=> {
      let parsedStartDate: Date = new Date(item.startDate)
      let parsedEndDate: Date = new Date(item.endDate);
      let diffTime: number = parsedEndDate.getTime() - parsedStartDate.getTime();
      let dataSplits: Date[]= this.getDateSplits(7, 1000 * 3600 * 24, dateEnd);
      this.populateResult(dataSplits, resultArr, parsedStartDate, parsedEndDate);
      if (item.work) {
        totalWorkTime += diffTime;
      } else {
        totalBreakTime += diffTime;
      }
    })
    this.barData = [totalBreakTime / (totalBreakTime + totalWorkTime), totalWorkTime / (totalBreakTime + totalWorkTime)];
    this.lineData = this.formatTo(resultArr, 1000 * 60);
    this.updateChart();
  }

  //Donut Info
  donutChartData: ChartDataSets[] = [
    { data: this.barData},
  ];
  donutChartLabels: Label[] = ['Break', 'Work'];
  donutChartType = 'doughnut' as ChartType;
  donutChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor:["rgba(0, 173, 181, 0.5)", "rgba(255, 122, 82, 0.8)"],
    },
  ];
  donutChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      labels: {
        fontColor: "black",
        fontSize: 22
      }
    },
  };

  //Line Chart Info
  lineChartData: ChartDataSets[] = [
    { data: this.lineData, label: 'Work Time',  borderColor: 'white'},
  ];
  lineChartLabels: Label[] = this.getWeekLabels();
  lineChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      labels: {
        fontColor: "black",
        fontSize: 16
      }
    },
    scales: {
      yAxes: [{
        ticks: {
            fontColor: "black",
            fontSize: 18,
            beginAtZero: true
        },
        display: true,
        scaleLabel: {
          display: true,
          labelString: "Time (Minutes)",
          fontColor: "black",
          fontSize: 15
        },
        
      }],
      xAxes: [{
        ticks: {
            fontColor: "black",
            fontSize: 14,
        },
        display: true,
        scaleLabel: {
          display: true,
          labelString: "Last 7 Days",
          fontColor: "black",
          fontSize: 15
        },
    }],
    }
  };
  lineChartColors: Color[] = [
    {
      borderColor: 'white',
      backgroundColor: 'rgba(92,184,92, 0.3)',
    },
  ];
  lineChartLegend = true;
  lineChartType = 'line' as ChartType;
  lineChartPlugins = [];


  constructor(private dbService: DatabaseServiceService) {
    dbService.sendUUID.subscribe((getUUID) => {
      this.localUUID = getUUID;
      this.userDataList = dbService.getDataObservable();
      this.saveUserData();
    })
  }

  ngOnInit(): void {
  }

}
