import { Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.css']
})
export class CustomSelectComponent implements OnInit {
  @Output() timeSelectedMessage = new EventEmitter<number[]>();
  acceptedCharCodes:number[] = [8, 26, 27, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
  workSeconds: string = "";
  workMinutes: string = "";
  breakSeconds: string = "";
  breakMinutes: string = "";
  workMinutesValid: boolean = true;
  workSecondsValid: boolean = true;
  breakMinutesValid: boolean = true;
  breakSecondsValid: boolean = true;
  showError: boolean = false;

  constructor() { }

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

  onSubmit() {
    if (this.workSecondsValid && this.workMinutesValid && this.breakSecondsValid && this.breakMinutesValid) {
      let workMin:number = this.workMinutes == "" ? 0 : parseInt(this.workMinutes);
      let workSec:number = this.workSeconds == "" ? 0 : parseInt(this.workSeconds);
      let breakMin:number = this.breakMinutes == "" ? 0 : parseInt(this.breakMinutes);
      let breakSec:number = this.breakSeconds == "" ? 0 : parseInt(this.breakSeconds);
      if (workMin == 0 && workSec == 0 && breakMin == 0 && breakSec == 0) {
        this.showError = true;
        return;
      }
      let sendValue =  [workMin, workSec, breakMin, breakSec];
      this.timeSelectedMessage.emit(sendValue);
      this.showError = false;
    } else {
      this.showError = true;
    }
  }
}
