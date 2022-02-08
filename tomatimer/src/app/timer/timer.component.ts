import { Component, Input, Output, OnInit, Inject, LOCALE_ID, EventEmitter, ViewChild, ElementRef, AfterContentInit, AfterViewInit, HostListener } from '@angular/core';
import { TimerInfo } from '../app.component';
import { interval, Subscription } from 'rxjs';
import { formatNumber, LocationStrategy } from '@angular/common';
import {trigger, state, style, animate, transition, keyframes} from '@angular/animations'
import { DatabaseServiceService, Timesheet, latestId } from '.././database-service.service';
import { AngularFireObject } from '@angular/fire/compat/database';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { TimerServiceService } from '../timer-service.service';


@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
  animations: [
    trigger('switchState', [
      state('first', style({
      })),
      state('second', style({
      })),
      transition ('first <=> second', [
        animate('1.25s ease-in-out', keyframes([
          style({
            transform: 'translateY(-224px)',
            offset: 0.35
          }),
          style({
            transform: 'translateY(-224px)',
            offset: 0.65
          }),
          style ({
            offset: 1
          })
        ])),
      ]),
    ]),
  ]
})

export class TimerComponent implements OnInit, AfterViewInit {
  @Input() obj: TimerInfo = {workHours: 0, workMinutes: 0, workSeconds: 0, breakHours: 0, breakMinutes: 0, breakSeconds: 0};
  @Output() backEvent = new EventEmitter<boolean>();
  @ViewChild('modalData') modalData!: ElementRef;
  isWork: boolean = true;
  switchState: boolean = true;
  disablePresses:boolean = false;
  displayString: string = "";
  moving: boolean = false;
  skipAlarm: boolean = true;
  audio: HTMLAudioElement = new Audio();
  looseCalls: number = 0;
  currentTimesheet: Timesheet = new Timesheet();
  timesheetObject?: AngularFireObject<latestId>;
  subscription: Subscription;
  currentTimeIndex = 0;
  localUUID:string = "";
  closeModal: string = "";
  leaveText: string = "Timer is still on going! Are you sure you want to leave?";
  currentSubscription?: Subscription;
  innerSubscription?:any ;
  timeout: any;
  finishChecked: boolean = false;

  constructor(@Inject(LOCALE_ID) public locale: string, private location: LocationStrategy, private dbService: DatabaseServiceService, private modalService: NgbModal, private timer: TimerServiceService) {
    //Handling timer repeat functionality
    const source = interval(200);
    this.subscription = source.subscribe(call => this.updateDisplay());
    history.pushState(null, "", window.location.href);
    this.location.onPopState(() => {
        history.pushState(null, "", window.location.href);
        this.onBack();
    });

    this.currentSubscription = dbService.sendUUID.subscribe((getUUID) => {
      if (this.innerSubscription) {
        this.innerSubscription.unsubscribe()
      }
      if (this.localUUID && !getUUID) { //Logout Case 
        this.pushCurrentData(this.localUUID);
      }
      this.localUUID = getUUID;
      this.currentTimesheet = new Timesheet();
      if (this.localUUID) {
        this.timesheetObject = dbService.getCurrentTimesheetObservable();
        this.innerSubscription = this.timesheetObject.valueChanges().subscribe((result) => {
          if (!result && this.localUUID) {
            dbService.setLatestTimeId(0);
            this.currentTimeIndex = 0;
          } else if (result){
            this.currentTimeIndex = result.timeId;
          }
        })
      }
    })

  }

  ngAfterViewInit(): void {
    
  }

  ngOnInit(): void {
    this.timer.initializeTimer(this.obj);
    this.audio.src = "assets/audio/alarmSound.mp3";
  }

  playAudio(){
    this.audio.play();
  }

  resetAudio(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
  }


  
@HostListener('window:beforeunload', ["$event"])
  onExit(e: Event) {
    if (this.moving) {
      this.onStop();
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeout);
  }

  //Press Start Button Functionality
  onStart(): void {
    if (!this.disablePresses) {
      if (!this.moving) {
        this.moving = true;
        this.timer.play();
        this.currentTimesheet = new Timesheet();
      }
    }
  }

  //Press Reset Button Functionality
  onReset(): void {
    if (!this.disablePresses) {
      if (this.moving) {
        this.moving = false;
        this.pushCurrentData();
        this.timer.pause();
      }
      this.skipAlarm = true;
      this.resetAudio();
      this.disablePresses = true;
      this.switchState = !this.switchState;
      setTimeout(() => {
        this.timer.reset();
      }, 500)
    }
  }

  pushCurrentData(localUUID?: string) {
    this.dbService.addTimerData(this.currentTimeIndex,
      this.currentTimesheet.startDate, 
      this.currentTimesheet.endDate,
      this.isWork, localUUID);
  }

  //Press Stop Button Functionality
  onStop(): void {
    if (!this.disablePresses) {
      if (this.moving) {
        this.moving = false;
        this.timer.pause();
        this.pushCurrentData();
      }
    }
  }

  //Press Skip to (Break or Work) Button Functionality
  onSkipTo(): void {
    if (!this.disablePresses) {
      if(this.moving) {
        this.moving = false;
        this.pushCurrentData()
        
      }
      this.skipAlarm = true;
      this.resetAudio();
      this.disablePresses = true;
      this.switchState = !this.switchState;
      this.isWork = !this.isWork;
      setTimeout(() => {
        this.timer.skipTo();
      }, 500)
    }
  }

  //When Animations are complete reenable button presses
  reenablePresses(): void {
    this.disablePresses = false;
  }

  onBack(): void {
    this.resetAudio();
    if (this.moving) {
      this.onStop();
      this.triggerModal(this.modalData, 'Back');
      
    } else {
      this.backEvent.emit(true);
    }
  }

  triggerModal(content: any, returnFunction: string) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((res) => {
      this.closeModal =  `${res}`;
      if (this.closeModal == 'Continue') {
        if (returnFunction == 'Back') {
          this.onBack();
        } else if (returnFunction == 'Logout') {
          
        }
      }
    }, (res) => {
      this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  updateDisplay() {
    this.displayString = this.timer.getDisplay();
    if (this.timer.isFinished()) {
      if (this.skipAlarm) {
        this.skipAlarm = false;
        console.log("playying")
        this.playAudio();
        setTimeout(()=> {
          if (!this.skipAlarm) {
            this.onSkipTo();
          }
        }, 6000)
      }
    }
  }
}
