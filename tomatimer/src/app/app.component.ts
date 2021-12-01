import { Component } from '@angular/core';

export interface TimerInfo {
  minutes: number;
  seconds: number;
  stringMin: string;
  stringSec: string;
};


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  startSec: number = 0
  startMin: number = 25
  title:string = 'tomatimer';
}
