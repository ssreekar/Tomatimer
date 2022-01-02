import { TimerComponent } from './timer/timer.component';
import { CustomSelectComponent } from './custom-select/custom-select.component';
import { TimeSelectComponent } from './time-select/time-select.component';
import { Component, AfterViewInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentFactory, ComponentRef} from '@angular/core';

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
    console.log("Add Time Select")
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
    console.log("Add Custom Page")
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
    console.log("Add Timer Page")
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
    if (this.orderOfPages.length < 2) {
      console.log("Error, order of pages is 2 small")
      return;
    }
    let lastPage = this.orderOfPages[this.orderOfPages.length - 2];
    if (lastPage == "timeSelect") {
      this.orderOfPages.pop()
      this.orderOfPages.pop()
      this.container.remove(0)
      this.loadTimeSelectPage();
      console.log(this.orderOfPages.toString())
    } else if (lastPage == "customPage") {
      this.orderOfPages.pop() 
      this.orderOfPages.pop()
      this.container.remove(0)
      this.loadCustomPage();
      console.log(this.orderOfPages.toString())
    }
  }

  
  testObj: TimerInfo = {workMinutes: 25, workSeconds: 0, breakMinutes: 5, breakSeconds: 0};
  title:string = 'tomatimer';
}
