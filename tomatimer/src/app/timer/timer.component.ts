import { Component, Input, OnInit, Inject, LOCALE_ID, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { TimerInfo } from '../app.component';
import { interval, Subscription } from 'rxjs';
import { formatNumber } from '@angular/common';
import {trigger, state, style, animate, transition, keyframes} from '@angular/animations'

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
  animations: [
    trigger('workBreak', [
      state('work', style({
      })),
      state('break', style({
      })),
      transition ('work => break', [
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
        ]))
      ]),
      transition('break => work', [
        animate('1.25s ease-in-out', keyframes([
          style({
            transform: 'translateY(-224px)',
            offset: 0.5
          }),
          style({
            transform: 'translateY(-224px)',
            offset: 0.65
          }),
          style ({
            offset: 1
          })
        ]))
      ])
    ])
  ]
})

export class TimerComponent implements OnInit {
  @Input() startMin: number = 0;
  @Input() startSec: number = 0;
  isWork: Boolean = true;
  obj:TimerInfo = {minutes: this.startMin, seconds:this.startSec, stringMin: "00", stringSec: "00"};
  subscription: Subscription;
  moving: boolean;
  imgSource: string = "Break";

  constructor(@Inject(LOCALE_ID) public locale: string,) {
    const source = interval(1000);
    this.subscription = source.subscribe(call => this.secPass());
    this.moving = true;
  }


  ngOnInit(): void {
    this.setMin(this.startMin);
    this.setSec(this.startSec);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setSec(seconds:number) {
    this.obj.seconds = seconds;
    this.obj.stringSec = formatNumber(this.obj.seconds, this.locale, '2.0');
  }

  setMin(minutes:number) {
    this.obj.minutes = minutes;
    this.obj.stringMin = formatNumber(this.obj.minutes, this.locale, '2.0');
  }

  onStart() {
    this.moving = true;
  }

  onReset() {
    this.moving = false;
    this.setMin(this.startMin);
    this.setSec(this.startSec);
    this.isWork = !this.isWork;
  }

  onStop() {
    this.moving = false;
  }

  onSkipToBreak() {
    //Code where Break is skipped to
  }

  //Future Updates: Make it so timer is saved to milliseconds so if we press pause at the last second
  //when play is pressed it is updated accordingly. 
  secPass() {
    if (!this.moving) {
      return;
    }
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
    this.setSec(this.obj.seconds);
    this.setMin(this.obj.minutes);
  }

}
