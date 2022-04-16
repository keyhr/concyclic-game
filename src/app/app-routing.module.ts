import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckerComponent } from './checker/checker.component';
import { GameComponent } from './game/game.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'checker', component: CheckerComponent },
  { path: 'game', component: GameComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
