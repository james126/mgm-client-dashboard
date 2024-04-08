import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index.component';


const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: '#about', component: IndexComponent },
  { path: '#services', component: IndexComponent },
  { path: '#contact', component: IndexComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexRoutingModule { }