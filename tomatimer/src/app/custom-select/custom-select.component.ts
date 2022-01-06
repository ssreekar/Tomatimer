import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { LocationStrategy } from '@angular/common';

class timeObj {
  secOnesIndex: number;
  secTensIndex: number;
  minOnesIndex: number;
  minTensIndex: number;
  hourOnesIndex: number;

  constructor() {
    this.secOnesIndex = 0;
    this.secTensIndex = 0;
    this.minOnesIndex = 0;
    this.minTensIndex = 0;
    this.hourOnesIndex = 0;
  }

  getTimeObject(): number[] {
    return [this.hourOnesIndex, (this.minTensIndex * 10) + this.minOnesIndex, (this.secTensIndex * 10) + this.secOnesIndex];
  }

  validTime(): boolean {
    if (this.hourOnesIndex || this.minTensIndex || this.minOnesIndex || this.secTensIndex || this.secOnesIndex) {
      return true;
    }
    return false;
  }

  copy(other: timeObj): void {
    this.secOnesIndex = other.secOnesIndex;
    this.secTensIndex = other.secTensIndex;
    this.minOnesIndex = other.minOnesIndex;
    this.minTensIndex = other.minTensIndex;
    this.hourOnesIndex = other.hourOnesIndex;
  }
 
};


@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.css']
})
export class CustomSelectComponent implements OnInit {
  @Output() timeSelectedMessage = new EventEmitter<number[]>();
  @Output() backEvent = new EventEmitter<boolean>();
  sixRollerPos: number[] = [-1168, -932, -697, -457, -219, 15]
  nineRollerPos: number[] = [-2116, -1880, -1645, -1405, -1167, -933, -698, -457, -222, 15]
  curTime: timeObj = new timeObj();
  workTime: timeObj = new timeObj();
  breakTime: timeObj = new timeObj();
  calculateWork:boolean = true;
  toBreak: boolean = true;
  isError:boolean = false;
  buttonDisabled:boolean = false;
  shakeError: boolean = false;
  workToBreak: boolean = false;
  breakToWork: boolean = false;

  constructor(private location:LocationStrategy) { 
    history.pushState(null, "", window.location.href);
    this.location.onPopState(() => {
        history.pushState(null, "", window.location.href);
        this.onBack();
    });
  }

  ngOnInit(): void {
  }


  onBack(): void {
    this.backEvent.emit(true);
  }

  onSubmit() {
    if (!this.buttonDisabled) {
      this.shakeError = true;
      setTimeout(()=> {
        this.shakeError = false;
      }, 250);
      this.copyToValue();
      if (this.workTime.validTime() && this.breakTime.validTime()) {
        let emitObject = this.workTime.getTimeObject().concat(this.breakTime.getTimeObject());
        this.timeSelectedMessage.emit(emitObject);
      } else {
        this.isError = true;
      }
    }
  }

  copyToValue(): void{
    if (this.calculateWork) {
      this.workTime.copy(this.curTime);
    } else {
      this.breakTime.copy(this.curTime);
    }
  }

  switchValue(): void {
    if (this.calculateWork) {
      this.curTime.copy(this.breakTime);
    } else {
      this.curTime.copy(this.workTime);
    }
  }

  updateCalculateWork():void {
    this.calculateWork = !this.calculateWork;
    if (this.calculateWork) {
      this.workToBreak = true;
      this.breakToWork = false;
    } else {
      this.workToBreak = false;
      this.breakToWork = true;
    }
  }

  swtichMode():void {
    if (!this.buttonDisabled) {
      this.buttonDisabled = true;
      this.copyToValue();
      this.switchValue();
      this.updateCalculateWork();
      setTimeout(()=> {
        this.toBreak = !this.toBreak;
      }, 400)
      setTimeout(()=> {
        this.buttonDisabled = false;
      }, 800)
    }
  }
}

