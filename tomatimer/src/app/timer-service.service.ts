import { ComponentFixture } from '@angular/core/testing';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { TimerInfo } from './app.component';
import { formatNumber, LocationStrategy } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TimerServiceService {
  initTimer?: TimerInfo;
  lastStartTime: number = 0;
  storedTime: number = 0;
  displayString: string =  "";
  
  isMoving: boolean = false;
  isWork: boolean = true;
  finished: boolean = false;

  constructor(@Inject(LOCALE_ID) public locale: string) { }


  //Helper Functions
  private resetTimers(): void {
    if (this.initTimer) {
      this.storedTime = 0;
      this.isMoving = false;
      this.setTimes();
    }
  }
  
  //Populate string values of second/minute values from default number values
  private setTimes(): void {
    if (this.initTimer) {
      let milliPassed = this.storedTime;
      if (this.isMoving) {
        let curDate: Date = new Date();
        milliPassed += curDate.getTime() - this.lastStartTime;
      }
      let secondsPassed = Math.floor(milliPassed / 1000);
      let totalTime = Math.max(0, this.getStartSeconds() - secondsPassed);
      
      if (totalTime == 0) {
        this.finished = true;
      }

      let curHour:number = Math.floor(totalTime / 3600);
      totalTime -= curHour * 3600;
      let curMinute: number = Math.floor(totalTime / 60);
      totalTime -= curMinute * 60;
      let curSecond: number = totalTime;

 
      let curStringSecond = formatNumber(curSecond, this.locale, '2.0');
      let curStringMinute = formatNumber(curMinute, this.locale, '2.0');
      let curStringHour = formatNumber(curHour, this.locale, '1.0');
      if (curStringHour == "0") {
        this.displayString = curStringMinute + " : " + curStringSecond;
      } else {
        this.displayString = curStringHour + " : " + curStringMinute + " : " + curStringSecond;
      }
    }
  }

  private computeTime(hours: number, minutes: number, seconds: number): number {
    return (hours * 3600) + (minutes * 60) + seconds;
  }

  private getStartSeconds(): number {
    if (this.isWork && this.initTimer) {
      return this.computeTime(this.initTimer.workHours, this.initTimer.workMinutes, this.initTimer.workSeconds)
    } else if (!this.isWork && this.initTimer) {
      return this.computeTime(this.initTimer.breakHours, this.initTimer.breakMinutes, this.initTimer.breakSeconds);
    }
    return 0;
  }

  
  initializeTimer(startTimer:TimerInfo) {
    this.initTimer = startTimer;
    this.resetTimers();
  }

  play(){
    if (!this.isMoving) {
      this.isMoving = true;
      let curDate: Date = new Date();
      this.lastStartTime = curDate.getTime();
    }
  }

  pause() {
    if (this.isMoving) {
      this.isMoving = false;
      let curDate: Date = new Date();
      this.storedTime += curDate.getTime() - this.lastStartTime; 
    }
  }

  reset() {
    this.resetTimers();
    this.finished = false;
  }

  skipTo() {
    this.isWork = !this.isWork;
    this.resetTimers();
    this.finished = false;
  }

  getDisplay(){
    this.setTimes();
    return this.displayString;
  }

  isFinished(): boolean {
    return this.finished;
  }

}
