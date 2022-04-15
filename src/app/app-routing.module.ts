import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CheckerComponent } from './checker/checker.component';

const routes: Routes = [
  { path: '', redirectTo: '/checker', pathMatch: 'full' },
  { path: 'checker', component: CheckerComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
