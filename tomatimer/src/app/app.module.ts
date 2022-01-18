import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TimerComponent } from './timer/timer.component';
import { TimeSelectComponent } from './time-select/time-select.component';
import { CustomSelectComponent } from './custom-select/custom-select.component';
import { BackgroundInfoComponent } from './background-info/background-info.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AppComponent,
    TimerComponent,
    TimeSelectComponent,
    CustomSelectComponent,
    BackgroundInfoComponent
  ],
  entryComponents: [
    TimeSelectComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    MatPasswordStrengthModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => getDatabase()),
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
