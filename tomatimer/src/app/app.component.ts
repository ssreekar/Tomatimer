import { TimerComponent } from './timer/timer.component';
import { CustomSelectComponent } from './custom-select/custom-select.component';
import { TimeSelectComponent } from './time-select/time-select.component';
import { Component, AfterViewInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentFactory, ComponentRef} from '@angular/core';
import { Time } from '@angular/common';

export interface TimerInfo {
  workMinutes: number;
  workSeconds: number;
  breakMinutes: number;
  breakSeconds: number;
};


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements  AfterViewInit{
  @ViewChild('testDiv', {read: ViewContainerRef}) container!: any;
  orderOfPages: string[] = []


  constructor(private resolver: ComponentFactoryResolver) {

  }

  ngAfterViewInit(): void {
    this.loadTimeSelectPage();
  }

  loadTimeSelectPage(): void {
    this.orderOfPages.push("timeSelect");
    let tempVal: ComponentRef<TimeSelectComponent>;
    let componentVal: ComponentFactory<TimeSelectComponent>;
    componentVal = this.resolver.resolveComponentFactory(TimeSelectComponent);
    tempVal = this.container.createComponent(this.resolver.resolveComponentFactory(TimeSelectComponent));
    tempVal.instance.timeSelectedMessage.subscribe(data => {
      this.timeSelectedParser(data);
    })
  }

  loadCustomPage():void {
    this.orderOfPages.push("customPage");
    let tempVal: ComponentRef<CustomSelectComponent>;
    let componentVal = this.resolver.resolveComponentFactory(CustomSelectComponent);
    tempVal = this.container.createComponent(this.resolver.resolveComponentFactory(CustomSelectComponent));
    tempVal.instance.timeSelectedMessage.subscribe(data => {
      this.timeSelectedParser(data);
    });
    tempVal.instance.backEvent.subscribe(data => {
      if (data) {
        this.loadPreviousPage();
      }
    });
  }

  loadTimerPage(data: number[]) {
    this.orderOfPages.push("timerPage")
    let tempVal: ComponentRef<TimerComponent>;
    let componentVal = this.resolver.resolveComponentFactory(TimerComponent);
    tempVal = this.container.createComponent(this.resolver.resolveComponentFactory(TimerComponent));
    let sendData: TimerInfo = {workMinutes: data[0], workSeconds: data[1], breakMinutes: data[2], breakSeconds: data[3]};
    tempVal.instance.obj = sendData;
    tempVal.instance.backEvent.subscribe(data => {
      if (data) {
        this.loadPreviousPage();
      }
    });
  }

  timeSelectedParser(data: number[]): void {
    if (data[0] == -1) {
      this.container.remove(0);
      this.loadCustomPage();
    } else {
      this.container.remove(0);
      this.loadTimerPage(data);
    }
  }

  loadPreviousPage(): void {
    this.orderOfPages.pop();
    let lastPage = this.orderOfPages[this.orderOfPages.length - 1];
    if (lastPage == "timeSelect") {
      this.container.remove(0)
      this.loadTimeSelectPage();
    } else if (lastPage == "customPage") {
      this.container.remove(0)
      this.loadCustomPage();
    }
  }

  
  testObj: TimerInfo = {workMinutes: 25, workSeconds: 0, breakMinutes: 5, breakSeconds: 0};
  title:string = 'tomatimer';
}
