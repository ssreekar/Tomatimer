import { TimeSelectComponent } from './time-select/time-select.component';
import { TimerComponent } from './timer/timer.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'first-component', component: TimerComponent},
  {path: 'second-component', component: TimeSelectComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 