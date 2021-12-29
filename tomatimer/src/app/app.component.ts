import { Component } from '@angular/core';

export interface TimerInfo {
  workMinutes: number;
  workSeconds: number;
  breakMinutes: number;
  breakSeconds: number;
};


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  testObj: TimerInfo = {workMinutes: 25, workSeconds: 0, breakMinutes: 5, breakSeconds: 0};
  title:string = 'tomatimer';
}
