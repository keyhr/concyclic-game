import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Board, Cell, ConcyclicJudger, isConcyclic } from '../board';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  boardSize = {
    x: 9,
    y: 9,
  };
  board: Board;
  cellHistory: Array<Cell> = new Array();

  containerSizePx: number = 500;

  isJudgingConcyclic = false;
  isBoardModeEnabled = false;
  isLabelDisplayEnabled = true;

  constructor(public dialog: MatDialog) {
    this.board = new Board(this.boardSize.x, this.boardSize.y);
    if (window.innerWidth < 600) this.containerSizePx = window.innerWidth * 0.9;
  }

  ngOnInit(): void {
    console.log(this.containerSizePx);
  }

  onCellClick(cell: Cell): void {
    if (this.isAfterAutoJudge) return;
    if (this.isJudgingConcyclic) {
      if (!cell.isPut || cell == this.cellHistory[this.cellHistory.length - 1])
        return;
      if (cell.isSelected || this.board.cellsSelected().length < 4)
        cell.toggleSelect();
    } else {
      if (!cell.isPut) this.cellHistory.push(cell);
      cell.isPut = true;
      if (this.isAutoJudgeEnabled) this.runAutoJudgeConcyclic();
    }
  }

  enterJudgeConcyclic(): void {
    if (this.cellHistory.length < 4) {
      this.dialog.open(MessageDialogComponent, {
        data: {
          title: '宣言失敗',
          content: '石が4つ未満です。',
        },
      });
      return;
    }
    this.board.clearSelection();
    const lastCell = this.cellHistory[this.cellHistory.length - 1];
    console.log(this.cellHistory);
    lastCell.toggleSelect();
    this.isJudgingConcyclic = true;
  }

  cancelJudgeConcyclic(): void {
    for (const cell of this.board.cellsSelected()) cell.cancelSelect();
    this.isJudgingConcyclic = false;
  }

  judgeConcyclic(): void {
    const result = isConcyclic(this.board.cellsSelected());
    if (result) {
      this.dialog.open(MessageDialogComponent, {
        data: {
          title: '宣言成功',
          content: '最後においた石を取り除いて再開します。',
        },
      });
      const lastCell = this.cellHistory.pop();
      lastCell?.clear();
    } else {
      this.dialog.open(MessageDialogComponent, {
        data: {
          title: '宣言失敗',
          content: 'この4つの石は共円ではありません。',
        },
      });
    }
    for (const cell of this.board.cellsSelected()) cell.cancelSelect();
    this.isJudgingConcyclic = false;
  }

  back(): void {
    const cell = this.cellHistory.pop();
    if (cell) cell!.isPut = false;
  }

  // Auto Judge Part

  isAutoJudgeEnabled = false;
  isAfterAutoJudge = false;
  searchResult: Cell[][] = new Array();
  resultIndex = 0;

  runAutoJudgeConcyclic(): void {
    const lastCell = this.cellHistory[this.cellHistory.length - 1];
    const judger = new ConcyclicJudger(
      this.board.cellsPut().filter((cell) => cell != lastCell)
    );
    this.searchResult = judger.fullSearch([lastCell]);

    if (this.searchResult.length != 0) {
      this.dialog.open(MessageDialogComponent, {
        data: {
          title: '共円',
          content:
            this.searchResult.length +
            'セット共円があります。下のボタンをおして再開してください。',
        },
      });
      this.resultIndex = 0;
      const firstResult = this.searchResult[this.resultIndex];
      for (const cell of firstResult) this.board.selectCell(cell.x, cell.y);
      this.isAfterAutoJudge = true;
    }
  }

  updateResultView(a: number): void {
    if (a == 1) this.resultIndex += 1;
    else if (a == -1) this.resultIndex -= 1;

    console.log(this.resultIndex);
    this.board.clearSelection();
    const result = this.searchResult[this.resultIndex];
    for (const cell of result) this.board.selectCell(cell.x, cell.y);
  }

  afterAutoJudge() {
    for (const cell of this.board.cellsSelected()) cell.cancelSelect();
    const lastCell = this.cellHistory.pop();
    lastCell?.clear();
    this.isAfterAutoJudge = false;
  }
}
