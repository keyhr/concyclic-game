export interface Cell {
  x: number;
  y: number;
  isPut: boolean;
}

export class Cell {
  x: number;
  y: number;
  isPut: boolean;

  constructor(x: number, y: number, isPut: boolean = false) {
    this.x = x;
    this.y = y;
    this.isPut = isPut;
  }

  toggle(): void {
    this.isPut = !this.isPut;
  }

  clear(): void {
    this.isPut = false;
  }
}

export class Board {

  width: number;
  height: number;
  board: Array<Array<Cell>>;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.board = new Array(height);
    for (let i = 0; i < height; ++i) {
      this.board[i] = new Array(width);
      for (let j = 0; j < width; ++j) {
        this.board[i][j] = new Cell(j, i);
      }
    }
  }

  cellsPut(): Array<Cell> {
    let ret: Array<Cell> = new Array();
    for (const row of this.board) for (const cell of row) if (cell.isPut) ret.push(cell);

    return ret;
  }

  clear(): void {
    for (const cell of this.cellsPut()) cell.clear();
  }

}

export function isConcyclic(cells: Array<Cell>): boolean {

  if (cells.length != 4) {
    return false;
  }

  let dx = new Array(3);
  let dy = new Array(3);

  for (let i = 0; i < 3; ++i) {
    dx[i] = cells[i].x - cells[3].x;
    dy[i] = cells[i].y - cells[3].y;
  }

  let sum = 0;
  for (let i = 0; i < 3; ++i) {
    sum += (dx[i] * dx[i] + dy[i] * dy[i]) * (dx[(i + 1) % 3] * dy[(i + 2) % 3] - dx[(i + 2) % 3] * dy[(i + 1) % 3]);
  }

  return sum == 0;

}
