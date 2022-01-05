import { Component, Input, Output, OnInit, Inject, LOCALE_ID, EventEmitter} from '@angular/core';
import { TimerInfo } from '../app.component';
import { interval, Subscription } from 'rxjs';
import { formatNumber, LocationStrategy } from '@angular/common';
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
  @Input() obj: TimerInfo = {workHours: 0, workMinutes: 0, workSeconds: 0, breakHours: 0, breakMinutes: 0, breakSeconds: 0};
  @Output() backEvent = new EventEmitter<boolean>();
  curSecond: number = 0;
  curMinute: number = 0;
  curHour: number = 0;
  curStringSecond: string = "00";
  curStringMinute: string = "00";
  curStringHour: string = "0";
  displayString: string =  "";
  isWork: boolean = true;
  switchState: boolean = true;
  disablePresses:boolean = false;
  moving: boolean = false;
  skipAlarm: boolean = true;
  subscription: Subscription;
  audio: HTMLAudioElement = new Audio();
  looseCalls: number = 0;

  constructor(@Inject(LOCALE_ID) public locale: string, private location: LocationStrategy) {
    //Handling timer repeat functionality
    const source = interval(1000);
    this.subscription = source.subscribe(call => this.secPass());
    history.pushState(null, "", window.location.href);
    this.location.onPopState(() => {
        history.pushState(null, "", window.location.href);
        this.onBack();
    });
  }

  ngOnInit(): void {
    this.resetTimers();
    this.audio.src = "assets/audio/alarmSound.mp3";
  }

  playAudio(){
    this.audio.play();
  }

  resetAudio(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  //Reset Timers to Default Work or Break values
  resetTimers(): void {
    if (this.isWork) {
      this.curHour = this.obj.workHours;
      this.curMinute = this.obj.workMinutes;
      this.curSecond = this.obj.workSeconds;
    } else {
      this.curHour = this.obj.breakHours;
      this.curMinute = this.obj.breakMinutes;
      this.curSecond = this.obj.breakSeconds;
    }
    this.setTimes();
  }

  //Populate string values of second/minute values from default number values
  setTimes(): void {
    this.curStringSecond = formatNumber(this.curSecond, this.locale, '2.0');
    this.curStringMinute = formatNumber(this.curMinute, this.locale, '2.0');
    this.curStringHour = formatNumber(this.curHour, this.locale, '1.0');
    if (this.curStringHour == "0") {
      this.displayString = this.curStringMinute + " : " + this.curStringSecond;
    } else {
      this.displayString = this.curStringHour + " : " + this.curStringMinute + " : " + this.curStringSecond;
    }
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
      this.skipAlarm = true;
      this.resetAudio();
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
      this.skipAlarm = true;
      this.resetAudio();
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

  onBack(): void {
    this.resetAudio();
    this.backEvent.emit(true);
  }


  //Future Updates: Make it so timer is saved to milliseconds so if we press pause at the last second
  //when play is pressed it is updated accordingly. 
  secPass(): void {
    if (!this.moving) {
      return;
    }
    if (this.curSecond == 0) {
      if (this.curMinute != 0) {
        this.curMinute -= 1;
        this.curSecond = 59;
      } else {
        if (this.curHour != 0) {
          this.curHour = 0;
          this.curMinute = 59;
          this.curSecond = 59;
        }
      }
    } else {
      this.curSecond -= 1;
      if (this.curSecond == 0 && this.curMinute == 0 && this.curHour == 0) {
        if (this.skipAlarm) {
          this.skipAlarm = false;
          this.playAudio();
          this.looseCalls++;
          setTimeout(()=> {
            if (!this.skipAlarm && this.looseCalls == 1) {
              this.onSkipTo();
            }
            this.looseCalls--;
          }, 6000)
        }
      }
    }
    this.setTimes();
  }
  
}
