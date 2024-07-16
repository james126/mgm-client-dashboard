import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing.component';


const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: '#about', component: LandingComponent },
  { path: '#services', component: LandingComponent },
  { path: '#contact', component: LandingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
