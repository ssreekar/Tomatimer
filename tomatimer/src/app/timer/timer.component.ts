import { Component, Input, OnInit, Inject, LOCALE_ID} from '@angular/core';
import { TimerInfo } from '../app.component';
import { interval, Subscription } from 'rxjs';
import { formatNumber } from '@angular/common';
import {trigger, state, style, animate, transition, keyframes} from '@angular/animations'

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
  animations: [
    trigger('switchState', [
      state('first', style({
      })),
      state('second', style({
      })),
      transition ('first <=> second', [
        animate('1.25s ease-in-out', keyframes([
          style({
            transform: 'translateY(-224px)',
            offset: 0.35
          }),
          style({
            transform: 'translateY(-224px)',
            offset: 0.65
          }),
          style ({
            offset: 1
          })
        ])),
      ]),
    ]),
  ]
})

export class TimerComponent implements OnInit {
  @Input() obj: TimerInfo = {workMinutes: 0, workSeconds: 0, breakMinutes: 0, breakSeconds: 0};
  curSecond: number = 0;
  curMinute: number = 0;
  curStringSecond: string = "00";
  curStringMinute: string = "00";
  isWork: boolean = true;
  switchState: boolean = true;
  disablePresses:boolean = false;
  moving: boolean = true;
  subscription: Subscription;

  constructor(@Inject(LOCALE_ID) public locale: string,) {
    //Handling timer repeat functionality
    const source = interval(1000);
    this.subscription = source.subscribe(call => this.secPass());
  }

  ngOnInit(): void {
    this.resetTimers();
  }

  //Reset Timers to Default Work or Break values
  resetTimers(): void {
    if (this.isWork) {
      this.curMinute = this.obj.workMinutes;
      this.curSecond = this.obj.workSeconds;
    } else {
      this.curMinute = this.obj.breakMinutes;
      this.curSecond = this.obj.breakSeconds;
    }
    this.setTimes();
  }

  //Populate string values of second/minute values from default number values
  setTimes(): void {
    this.curStringSecond = formatNumber(this.curSecond, this.locale, '2.0');
    this.curStringMinute = formatNumber(this.curMinute, this.locale, '1.0');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  //Press Start Button Functionality
  onStart(): void {
    if (!this.disablePresses) {
      this.moving = true;
    }
  }

  //Press Reset Button Functionality
  onReset(): void {
    if (!this.disablePresses) {
      this.disablePresses = true;
      this.moving = false;
      this.switchState = !this.switchState;
      setTimeout(() => {
        this.resetTimers();
      }, 500)
    }
  }

  //Press Stop Button Functionality
  onStop(): void {
    if (!this.disablePresses) {
      this.moving = false;
    }
  }

  //Press Skipto (Break or Work) Button Functionality
  onSkipTo(): void {
    if (!this.disablePresses) {
      this.disablePresses = true;
      this.moving = false;
      this.switchState = !this.switchState;
      this.isWork = !this.isWork;
      setTimeout(() => {
        this.resetTimers();
      }, 500)
    }
  }

  //When Animations are complete reenable button presses
  reenablePresses(): void {
    this.disablePresses = false;
  }

  //Future Updates: Make it so timer is saved to milliseconds so if we press pause at the last second
  //when play is pressed it is updated accordingly. 
  secPass(): void {
    if (!this.moving) {
      return;
    }
    if (this.curSecond == 0) {
      if (this.curMinute == 0) {
        console.log("DONE!!");
      } else {
        this.curMinute -= 1;
        this.curSecond = 59;
      }
    } else {
      this.curSecond -= 1;
    }
    this.setTimes();
  }

}
