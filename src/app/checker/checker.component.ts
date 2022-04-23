import { Component, OnInit } from '@angular/core';
import { Board, Cell, ConcyclicJudger, isConcyclic } from '../board';

@Component({
  selector: 'app-checker',
  templateUrl: './checker.component.html',
  styleUrls: ['./checker.component.css'],
})
export class CheckerComponent implements OnInit {
  boardSize = {
    x: 9,
    y: 9,
  };
  board: Board;

  judge = {
    fontColor: '#777777',
    content: '-',
  };

  containerSizePx: number = 500;

  isRequiredNewVersion = true;

  constructor() {
    this.board = new Board(this.boardSize.x, this.boardSize.y);
  }

  ngOnInit(): void {
    if (window.innerWidth < 600) this.containerSizePx = window.innerWidth * 0.8;
  }

  onCellClick(cell: Cell) {
    if (this.isRequiredNewVersion) {
      cell.toggle();
      this.searchConcyclic();
    } else {
      if (cell.isPut || this.board.cellsPut().length < 4) {
        cell.toggle();
      }

      const cellsPut = this.board.cellsPut();

      this.judgeConcyclic(cellsPut);
    }
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

  resultIndex = -1;
  searchResult: Cell[][] = new Array();

  searchConcyclic() {
    const judger = new ConcyclicJudger(this.board.cellsPut());
    this.searchResult = judger.fullSearch();
    this.resultIndex = -1;
    this.updateResultView();
  }

  updateResultView(mode?: number) {
    if (mode == 1) this.resultIndex += 1;
    else if (mode == -1) this.resultIndex -= 1;

    if (this.resultIndex >= this.searchResult.length)
      this.resultIndex = this.searchResult.length - 1;
    if (this.resultIndex < 0) this.resultIndex = -1;

    this.board.clearSelection();
    const result = this.searchResult[this.resultIndex];
    for (const cell of result) this.board.selectCell(cell.x, cell.y);
  }

  reset(): void {
    this.board.clear();
    this.judge.content = '-';
  }
}
