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


  constructor(private resolver: ComponentFactoryResolver) {

  }

  ngAfterViewInit(): void {
    this.loadTimeSelectPage();
  }

  loadTimeSelectPage(): void {
    let tempVal: ComponentRef<TimeSelectComponent>;
    let componentVal: ComponentFactory<TimeSelectComponent>;
    componentVal = this.resolver.resolveComponentFactory(TimeSelectComponent);
    tempVal = this.container.createComponent(this.resolver.resolveComponentFactory(TimeSelectComponent));
    tempVal.instance.timeSelectedMessage.subscribe(data => {
      this.timeSelectedParser(data);
    })
  }

  loadCustomPage():void {
    let tempVal: ComponentRef<CustomSelectComponent>;
    let componentVal = this.resolver.resolveComponentFactory(CustomSelectComponent);
    tempVal = this.container.createComponent(this.resolver.resolveComponentFactory(CustomSelectComponent));
    tempVal.instance.timeSelectedMessage.subscribe(data => {
      if (data[0] == -1) {
        this.loadCustomPage();
      } else {
        this.container.remove(0);
        this.loadTimerPage(data);
      }
    })
  }

  loadTimerPage(data: number[]) {
    let tempVal: ComponentRef<TimerComponent>;
    let componentVal = this.resolver.resolveComponentFactory(TimerComponent);
    tempVal = this.container.createComponent(this.resolver.resolveComponentFactory(TimerComponent));
  
  }

  timeSelectedParser(data: number[]): void {
    if (data[0] == -1) {
      this.loadCustomPage();
    } else {
      this.container.remove(0);
      this.loadTimerPage(data);
    }
  }

  testObj: TimerInfo = {workMinutes: 25, workSeconds: 0, breakMinutes: 5, breakSeconds: 0};
  title:string = 'tomatimer';
}
