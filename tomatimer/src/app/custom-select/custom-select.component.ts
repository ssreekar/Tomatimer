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
  acceptedCharCodes:number[] = [8, 26, 27, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
  workSeconds: string = "";
  workMinutes: string = "";
  breakSeconds: string = "";
  breakMinutes: string = "";
  workMinutesValid: boolean = true;
  workSecondsValid: boolean = true;
  breakMinutesValid: boolean = true;
  breakSecondsValid: boolean = true;
  sixRollerPos: number[] = [-1053, -862, -645, -422, -204, 22]
  nineRollerPos: number[] = [-1936, -1745, -1528, -1305, -1087, -863, -644, -423, -205, 20]
  curTime: timeObj = new timeObj();
  workTime: timeObj = new timeObj();
  breakTime: timeObj = new timeObj();
  calculateWork:boolean = true;
  toBreak: boolean = true;
  isError:boolean = false;
  buttonDisabled:boolean = false;
  shakeError: boolean = false;

  constructor(private location:LocationStrategy) { 
    history.pushState(null, "", window.location.href);
    this.location.onPopState(() => {
        history.pushState(null, "", window.location.href);
        this.onBack();
    });
  }

  ngOnInit(): void {
  }

  checkMinuteString(value: string):boolean {
    if (value == "" || parseInt(value) >= 0) {
      return true;  
    }
    return false;
  }

  checkSecondString(value: string): boolean {
    if (value == "" || (parseInt(value) >= 0 && parseInt(value) <= 59)) {
      return true;
    }
    return false;
  }

  updateWorkMinutes(event:any) {
    this.workMinutes = event.target.value;
    this.workMinutesValid = this.checkMinuteString(this.workMinutes);
  }


  updateWorkSeconds(event:any) {
    this.workSeconds = event.target.value;
    this.workSecondsValid = this.checkSecondString(this.workSeconds);
  }

  updateBreakMinutes(event:any){
    this.breakMinutes = event.target.value;
    this.breakMinutesValid = this.checkMinuteString(this.breakMinutes);
  }

  updateBreakSeconds(event:any){
    this.breakSeconds = event.target.value;
    this.breakSecondsValid = this.checkSecondString(this.breakSeconds);
  }

  numberOnly(event:any, seconds?:boolean):boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    const returnValue = this.acceptedCharCodes.includes(charCode);
    return returnValue;
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

  swtichMode():void {
    if (!this.buttonDisabled) {
      this.buttonDisabled = true;
      this.copyToValue();
      this.switchValue();
      this.calculateWork = !this.calculateWork;
      setTimeout(()=> {
        this.toBreak = !this.toBreak;
      }, 400)
      setTimeout(()=> {
        this.buttonDisabled = false;
      }, 800)
    }
  }
}

