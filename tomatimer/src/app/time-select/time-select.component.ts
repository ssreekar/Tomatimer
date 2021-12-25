import { Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-time-select',
  templateUrl: './time-select.component.html',
  styleUrls: ['./time-select.component.css']
})
export class TimeSelectComponent implements OnInit {

  @Output() messageEvent = new EventEmitter<number[]>();

  constructor() { }

  ngOnInit(): void {
  }

  standardClick() {
    this.messageEvent.emit([25, 5]);
  }

  extraClick() {
    this.messageEvent.emit([50, 10]);
  }

  customClick() {
    console.log("CustomClick");
  }

}
