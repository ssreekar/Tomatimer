import { BackgroundInfoComponent } from './background-info/background-info.component';
import { TimerComponent } from './timer/timer.component';
import { CustomSelectComponent } from './custom-select/custom-select.component';
import { TimeSelectComponent } from './time-select/time-select.component';
import { Component, AfterViewInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentFactory, ComponentRef} from '@angular/core';

export interface TimerInfo {
  workHours: number;
  workMinutes: number;
  workSeconds: number;
  breakHours: number;
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

  removeTop(): void {
    if (this.container.length != 0) {
      this.container.remove(0);
    }
  }

  loadTimeSelectPage(): void {
    this.removeTop();
    console.log("Add Time Select")
    this.orderOfPages.push("timeSelect");
    let tempVal: ComponentRef<TimeSelectComponent>;
    let componentVal = this.resolver.resolveComponentFactory(TimeSelectComponent);
    tempVal = this.container.createComponent(componentVal);
    tempVal.instance.timeSelectedMessage.subscribe(data => {
      this.timeSelectedParser(data);
    })
  }

  loadCustomPage():void {
    this.removeTop();
    console.log("Add Custom Page")
    this.orderOfPages.push("customPage");
    let tempVal: ComponentRef<CustomSelectComponent>;
    let componentVal = this.resolver.resolveComponentFactory(CustomSelectComponent);
    tempVal = this.container.createComponent(componentVal);
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
    this.removeTop();
    console.log("Add Timer Page")
    this.orderOfPages.push("timerPage")
    let tempVal: ComponentRef<TimerComponent>;
    let componentVal = this.resolver.resolveComponentFactory(TimerComponent);
    tempVal = this.container.createComponent(componentVal);
    let sendData: TimerInfo = {workHours: data[0], workMinutes: data[1], workSeconds: data[2], 
      breakHours: data[3], breakMinutes: data[4], breakSeconds: data[5]};
    tempVal.instance.obj = sendData;
    tempVal.instance.backEvent.subscribe(data => {
      if (data) {
        this.loadPreviousPage();
      }
    });
  }

  loadBackgroundPage() {
    this.removeTop();
    console.log("Add Background Page");
    this.orderOfPages.push("backgroundPage");
    let tempVal: ComponentRef<BackgroundInfoComponent>;
    let componentVal = this.resolver.resolveComponentFactory(BackgroundInfoComponent);
    tempVal = this.container.createComponent(componentVal);
  }

  timeSelectedParser(data: number[]): void {
    if (data[0] == -1) {
      this.loadCustomPage();
    } else {
      this.loadTimerPage(data);
    }
  }

  loadPreviousPage(): void {
    if (this.orderOfPages.length < 2) {
      console.log("Error, order of pages is 2 small")
      return;
    }
    let lastPage = this.orderOfPages[this.orderOfPages.length - 2];
    if (lastPage == "timeSelect") {
      this.orderOfPages.pop();
      this.orderOfPages.pop();
      this.loadTimeSelectPage();
    } else if (lastPage == "customPage") {
      this.orderOfPages.pop(); 
      this.orderOfPages.pop();
      this.loadCustomPage();
    } else if (lastPage == "backgroundPage") {
      this.orderOfPages.pop(); 
      this.orderOfPages.pop();
      this.loadCustomPage();
    }
  }

  getCurPage(): string {
    return this.orderOfPages[this.orderOfPages.length - 1]
  }

  title:string = 'tomatimer';
}
