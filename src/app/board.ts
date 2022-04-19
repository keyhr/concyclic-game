export interface Cell {
  x: number;
  y: number;
  isPut: boolean;
}

export class Cell {
  x: number;
  y: number;
  isPut: boolean;
  color: string;
  isSelected: boolean;

  constructor(x: number, y: number, isPut: boolean = false) {
    this.x = x;
    this.y = y;
    this.isPut = isPut;
    this.color = '#000000';
    this.isSelected = false;
  }

  toggle(): void {
    this.isPut = !this.isPut;
  }

  enableSelect(highlightColor: string = 'red'): void {
    this.color = highlightColor;
    this.isSelected = true;
  }

  toggleSelect(highlightColor: string = 'red'): void {
    if (this.isSelected) this.color = '#000000';
    else this.color = highlightColor;
    this.isSelected = !this.isSelected;
  }

  cancelSelect(): void {
    this.isSelected = false;
    this.color = '#000000';
  }

  clear(): void {
    this.isPut = false;
    this.cancelSelect();
  }
}

export class Board {
  width: number;
  height: number;
  board: Cell[][];

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

  cellsPut(): Cell[] {
    let ret: Cell[] = new Array();
    for (const row of this.board)
      for (const cell of row) if (cell.isPut) ret.push(cell);

    return ret;
  }

  cellsSelected(): Cell[] {
    let ret: Cell[] = new Array();
    for (const row of this.board)
      for (const cell of row) if (cell.isSelected) ret.push(cell);

    return ret;
  }

  selectCell(x: number, y: number): void {
    this.board[y][x].enableSelect();
  }

  clearSelection(): void {
    for (const cell of this.cellsSelected()) cell.cancelSelect();
  }

  clear(): void {
    for (const cell of this.cellsPut()) cell.clear();
  }
}

export function isConcyclic(cells: Cell[]): boolean {
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
    sum +=
      (dx[i] * dx[i] + dy[i] * dy[i]) *
      (dx[(i + 1) % 3] * dy[(i + 2) % 3] - dx[(i + 2) % 3] * dy[(i + 1) % 3]);
  }

  return sum == 0;
}

export class ConcyclicJudger {
  cellsToSearch: Cell[] = new Array();

  private cellsTemp: Cell[] = new Array();

  constructor(cellsToSearch: Cell[]) {
    this.cellsToSearch = cellsToSearch;
  }

  fullSearch(): Cell[][] {
    const result: Cell[][] = new Array();
    this.cellsTemp = new Array();

    this.dfs(result, 0, -1);

    return result;
  }

  lightSearch(): Cell[][] {
    const result: Cell[][] = new Array();
    this.cellsTemp = new Array();

    this.dfs(result, 0, -1, true);

    return result;
  }

  private dfs(
    result: Cell[][],
    depth: number,
    a: number,
    light: boolean = false
  ): void {
    if (depth == 4) {
      if (isConcyclic(this.cellsTemp)) {
        let temp: Cell[] = new Array();
        for (let cell of this.cellsTemp) temp.push(new Cell(cell.x, cell.y));
        result.push(temp);
        if (light) return;
      }
    } else {
      for (let i = a + 1; i < this.cellsToSearch.length; ++i) {
        this.cellsTemp[depth] = this.cellsToSearch[i];
        this.dfs(result, depth + 1, i, light);
      }
    }
  }
}
