import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Board, Cell } from '../board';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  @Input() board?: Board;
  @Output() cellClickEvent = new EventEmitter<Cell>();
  @Input() labelDisplay: boolean = true;

  @Input() viewSizePx: number = 500;
  cellSizePx: number = 0;

  guideThicknessPx: number = 30;

  constructor(public utils: UtilsService) {}

  ngOnInit(): void {
    if (!this.board) return;
    // if (window.innerWidth < 600) this.viewSizePx = window.innerWidth * 0.8;
    this.cellSizePx =
      (this.viewSizePx - this.guideThicknessPx * 2) / this.board!.width;
  }

  onCellClick(cell: Cell) {
    this.cellClickEvent.emit(cell);
  }
}
