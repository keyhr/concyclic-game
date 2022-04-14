import { Component, OnInit } from '@angular/core';
import { Board, Cell, isConcyclic } from '../board';

@Component({
  selector: 'app-checker',
  templateUrl: './checker.component.html',
  styleUrls: ['./checker.component.css']
})
export class CheckerComponent implements OnInit {

  board: Board = new Board(9, 9);

  judgeContent: string = '-';
  judgeFontColor: string = '#777777';

  constructor() { }

  ngOnInit(): void {
  }

  onCellClick(cell: Cell) {
    if (cell.isPut || this.board.cellsPut().length < 4) {
      cell.isPut = !cell.isPut;
    }

    this.judgeConcyclic();
  }

  judgeConcyclic() {
    const cellsPut = this.board.cellsPut();
    if (cellsPut.length != 4) {
      this.judgeContent = '-';
    } else {
      if (isConcyclic(cellsPut)) {
        this.judgeContent = '○';
      } else {
        this.judgeContent = '×';
      }
    }
  }

}
