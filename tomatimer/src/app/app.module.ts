import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TimerComponent } from './timer/timer.component';
import { TimeSelectComponent } from './time-select/time-select.component';
import { CustomSelectComponent } from './custom-select/custom-select.component';


@NgModule({
  declarations: [
    AppComponent,
    TimerComponent,
    TimeSelectComponent,
    CustomSelectComponent
  ],
  entryComponents: [
    TimeSelectComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
