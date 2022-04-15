import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Cell } from '../board';

@Component({
  selector: 'app-board-cell',
  templateUrl: './board-cell.component.html',
  styleUrls: ['./board-cell.component.css']
})
export class BoardCellComponent implements OnInit {

  @Input() cell?: Cell;
  @Input() sizePx: number = 100;

  @Output() clickEvent = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onClick(): void {
    this.clickEvent.emit();
  }

}
