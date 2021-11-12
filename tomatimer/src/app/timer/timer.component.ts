import { Component, Input, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { TimerInfo } from '../app.component';
import { interval, Subscription } from 'rxjs';
import { formatNumber } from '@angular/common';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})

export class TimerComponent implements OnInit {
  @Input() obj:TimerInfo = {minutes:0, seconds:0, stringMin: "00", stringSec: "00"};
  subscription: Subscription;

  constructor(@Inject(LOCALE_ID) public locale: string,) {
    const source = interval(1000);
    this.subscription = source.subscribe(call => this.secPass());
  }

  ngOnInit(): void {
    
  }

  secPass() {
    if (this.obj.seconds == 0) {
      if (this.obj.minutes == 0) {
        console.log("DONE!!");
      } else {
        this.obj.minutes -= 1;
        this.obj.seconds = 59;
      }
    } else {
      this.obj.seconds -= 1; 
    }
    this.obj.stringMin = formatNumber(this.obj.minutes, this.locale, '2.0');
    this.obj.stringSec = formatNumber(this.obj.seconds, this.locale, '2.0');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
