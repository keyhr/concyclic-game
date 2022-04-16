import { Component, OnInit } from '@angular/core';
import { Board, Cell, isConcyclic } from '../board';

@Component({
  selector: 'app-checker',
  templateUrl: './checker.component.html',
  styleUrls: ['./checker.component.css']
})
export class CheckerComponent implements OnInit {

  boardSize = {
    x: 9,
    y: 9
  };
  board: Board;

  judge = {
    'fontColor': '#777777',
    'content': '-',
  };

  containerSizePx: number = 500;

  constructor() {
    this.board = new Board(this.boardSize.x, this.boardSize.y);
  }

  ngOnInit(): void {
    if (window.innerWidth < 600) this.containerSizePx = window.innerWidth * 0.8;
  }

  onCellClick(cell: Cell) {
    if (cell.isPut || this.board.cellsPut().length < 4) {
      cell.toggle();
    }

    const cellsPut = this.board.cellsPut();

    this.judgeConcyclic(cellsPut);
  }

  judgeConcyclic(cellsPut: Array<Cell>) {
    if (cellsPut.length != 4) {
      this.judge.content = '-';
    } else {
      if (isConcyclic(cellsPut)) {
        this.judge.content = '共円';
      } else {
        this.judge.content = 'OK';
      }
    }
  }

  reset(): void {
    this.board.clear();
    this.judge.content = '-';
  }

}
