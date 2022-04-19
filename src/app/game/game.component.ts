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
  // isAutoJudgeEnabled = false;
  isAutoJudgeEnabled = true;
  isAfterAutoJudge = false;

  constructor(public dialog: MatDialog) {
    this.board = new Board(this.boardSize.x, this.boardSize.y);
  }

  ngOnInit(): void {
    if (window.innerWidth < 600) this.containerSizePx = window.innerWidth * 0.8;
  }

  onCellClick(cell: Cell): void {
    if (this.isAfterAutoJudge) return;
    if (this.isJudgingConcyclic) {
      if (!cell.isPut || cell == this.cellHistory[this.cellHistory.length - 1])
        return;
      if (cell.isSelected || this.board.cellsSelected().length < 4)
        cell.toggleSelect();
    } else {
      cell.isPut = true;
      this.cellHistory.push(cell);
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
    const lastCell = this.cellHistory[this.cellHistory.length - 1];
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

  runAutoJudgeConcyclic(): void {
    const judger = new ConcyclicJudger(this.board.cellsPut());
    const searchResult = judger.lightSearch();

    if (searchResult.length != 0) {
      this.dialog.open(MessageDialogComponent, {
        data: {
          content: '共円です。下のボタンをおして再開してください。',
        },
      });
      const firstResult = searchResult[0];
      for (const cell of firstResult) {
        this.board.selectCell(cell.x, cell.y);
      }
      this.isAfterAutoJudge = true;
    }
  }

  afterAutoJudge() {
    for (const cell of this.board.cellsSelected()) cell.cancelSelect();
    const lastCell = this.cellHistory.pop();
    lastCell?.clear();
    this.isAfterAutoJudge = false;
  }
}
