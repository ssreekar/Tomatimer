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

  obj:TimerInfo = {
    minutes: 25,
    seconds: 0,
    stringMin: "25",
    stringSec: "00"
  }

  title = 'tomatimer';
}
