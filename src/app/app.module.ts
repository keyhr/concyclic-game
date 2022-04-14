import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BoardCellComponent } from './board-cell/board-cell.component';
import { CheckerComponent } from './checker/checker.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardCellComponent,
    CheckerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
