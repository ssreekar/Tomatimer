import { Component, Input, OnInit } from '@angular/core';
import { TimerInfo } from '../app.component';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {
  @Input() obj:TimerInfo = {foo:0, bar:1};

  ngOnInit(): void {
  }

}
