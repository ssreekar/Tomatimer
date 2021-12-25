import { Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.css']
})
export class CustomSelectComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<number[]>();
  acceptedCharCodes:number[] = [8, 26, 27, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
  workTime:string = "";
  breakTime:string = "";

  constructor() { }

  ngOnInit(): void {
  }

  updateWork(event:any) {
    this.workTime = event.target.value;
  }

  updateBreak(event:any){
    this.breakTime = event.target.value    
  }

  numberOnly(event:any):boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return this.acceptedCharCodes.includes(charCode);
  }

  onSubmit() {
    this.messageEvent.emit([parseInt(this.workTime), parseInt(this.breakTime)]);
  }

}
