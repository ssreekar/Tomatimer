import { Component } from '@angular/core';

export interface TimerInfo {
  foo: Number;
  bar: Number;
};


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  obj:TimerInfo = {
    foo: 10,
    bar: 20
  }
  title = 'tomatimer';
}
