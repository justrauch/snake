import { ChangeDetectorRef, Component } from '@angular/core';
import { Field } from './models/Field';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-minesweeper',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.css']
})
export class MinesweeperComponent {

  table: Field[][] = [];

  rows = 16
  cols = 30

  bombs = 0;

  difficulty = 0;

  constructor(private cd: ChangeDetectorRef) {
    this.initTable();
  }

  setDifficulty(x: number){
    if(x <= 0){
      this.rows = 9;
      this.cols = 9;
    }
    else if(x === 1){
      this.rows = 16;
      this.cols = 16;
    }
    else {
      this.rows = 16;
      this.cols = 30;
    }
    this.initTable();
  }

  revealField(x: number, y: number, isStart: boolean = true): void {

    const field = this.table[y][x];

    if (field.is_revealed) return;

    if (isStart && field.type < 0) {
      this.table.forEach(row =>
        row.forEach(cell => cell.is_revealed = true)
      );
      return;
    }

    field.is_revealed = true;

    if (field.type !== 0) return;

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {

        if (dx === 0 && dy === 0) continue;

        const nx = x + dx;
        const ny = y + dy;

        if (
          nx >= 0 &&
          nx < this.cols &&
          ny >= 0 &&
          ny < this.rows
        ) {
          this.revealField(nx, ny, false);
        }

      }
    }
  }

  initTable (): void {
    this.generateTable();
    this.spawnBombs();
  }

  generateTable(): void {
    this.table = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () =>
        new Field(0, false)
      )
    );
  }

  spawnBombs(): void {
    this.bombs = Math.floor(this.rows * this.cols * 0.1);

    for (let i = 0; i < this.bombs; i++) {
      let x: number;
      let y: number;

      do {
        x = Math.floor(Math.random() * this.cols);
        y = Math.floor(Math.random() * this.rows);
      } while (this.table[y][x].type !== 0);

      this.table[y][x].type = -1;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {

          if (dx === 0 && dy === 0) continue;

          const nx = x + dx;
          const ny = y + dy;

          if (
            nx >= 0 &&
            nx < this.cols &&
            ny >= 0 &&
            ny < this.rows &&
            this.table[ny][nx].type !== -1
          ) {
            this.table[ny][nx].type++;
          }

        }
      }
    }
  }
}
