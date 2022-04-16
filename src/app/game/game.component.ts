import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Board, Cell, isConcyclic } from '../board';
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

  constructor(public dialog: MatDialog) {
    this.board = new Board(this.boardSize.x, this.boardSize.y);
  }

  ngOnInit(): void {
    if (window.innerWidth < 600) this.containerSizePx = window.innerWidth * 0.8;
  }

  onCellClick(cell: Cell): void {
    if (this.isJudgingConcyclic) {
      if (!cell.isPut || cell == this.cellHistory[this.cellHistory.length - 1])
        return;
      if (cell.isSelected || this.board.cellsSelected().length < 4)
        cell.toggleSelect();
    } else {
      cell.isPut = true;
      this.cellHistory.push(cell);
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

  back() {
    const cell = this.cellHistory.pop();
    if (cell) cell!.isPut = false;
  }
}
