import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-account-summary',
  templateUrl: './account-summary.component.html',
  styleUrls: ['./account-summary.component.css']
})
export class AccountSummaryComponent implements OnInit {
  isLoggedIn: boolean = false;

  donutChartData: ChartDataSets[] = [
    { data: [10, 90] },
  ];

  donutChartLabels: Label[] = ['Break', 'Work'];
  donutChartType = 'doughnut' as ChartType;

  donutChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor:["#FF7360", "#6FC8CE"] 
    },
  ];


  lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
  ];
  lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  lineChartOptions = {
    responsive: true,
  };
  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  lineChartLegend = true;
  lineChartType = 'line' as ChartType;
  lineChartPlugins = [];

  constructor() { }

  ngOnInit(): void {
  }

}
