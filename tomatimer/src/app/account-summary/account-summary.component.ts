import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { AngularFireObject } from '@angular/fire/compat/database';
import { DatabaseServiceService } from '../database-service.service';

@Component({
  selector: 'app-account-summary',
  templateUrl: './account-summary.component.html',
  styleUrls: ['./account-summary.component.css']
})
export class AccountSummaryComponent implements OnInit {
  weekDays: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  localUUID: string = "";

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

  //Donut Info

  donutChartData: ChartDataSets[] = [
    { data: [0.1, 0.9] },
  ];

  donutChartLabels: Label[] = ['Break', 'Work'];
  donutChartType = 'doughnut' as ChartType;

  donutChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor:["rgba(152,251,152, 0.6)", "rgba(244, 113, 116, 0.7)"],
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
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Work Time',  borderColor: 'white'},
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
    })
  }

  
  
  ngOnInit(): void {
  }

}
