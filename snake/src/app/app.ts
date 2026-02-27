import { ChangeDetectorRef, Component } from '@angular/core';
import { Field } from './models/Field';
import { Type } from './models/Type';
import { NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {

  /* ===============================
     Spielfeld
  =============================== */

  rows = 20;
  cols = 20;

  table: Field[][] = [];

  /* ===============================
     Snake-Status
  =============================== */

  snakeTailX = 0;
  snakeTailY = 0;

  snakeHeadX = 0;
  snakeHeadY = 0;

  snakeLength = 0;

  /* ===============================
     Bewegung
  =============================== */

  directionX = 1;
  directionY = 0;

  /* ===============================
     Score
  =============================== */

  score = 0;
  bestScore = 0;

  private gameIntervalId: any;

  constructor(private cd: ChangeDetectorRef) {
    this.initTable();
  }

  /* ==========================================================
     Spiel neu initialisieren
  ========================================================== */

  initTable(): void {

    this.snakeTailX = 0;
    this.snakeTailY = 0;

    this.snakeLength = 8;

    this.score = 0;

    this.snakeHeadX = this.snakeLength + 1;
    this.snakeHeadY = 0;

    this.directionX = 1;
    this.directionY = 0;

    this.generateTable();
    this.initSnake();
    this.spawnFruit();
  }

  reset(): void {
    clearInterval(this.gameIntervalId);
    this.initTable();
  }

  /* ==========================================================
     Game Loop starten
  ========================================================== */

  startGame(): void {
    this.gameIntervalId = setInterval(() => {
      this.moveSnake(this.directionX, this.directionY);
      this.cd.detectChanges();
    }, 200);
  }

  /* ==========================================================
     Spielfeld erzeugen
  ========================================================== */

  generateTable(): void {
    this.table = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () =>
        new Field(Type.Empty, 0, 0, 'empty')
      )
    );
  }

  /* ==========================================================
     Snake initial aufbauen
  ========================================================== */

  initSnake(): void {

    // Tail setzen
    this.table[this.snakeTailY][this.snakeTailX] =
      new Field(Type.Tail, 1, 0, 'tail-right');

    // Body setzen
    for (let i = 1; i <= this.snakeLength; i++) {
      this.table[this.snakeTailY][this.snakeTailX + i] =
        new Field(Type.Body, 1, 0, 'body-horizontal');
    }

    // Head setzen
    this.table[this.snakeTailY][this.snakeTailX + this.snakeLength + 1] =
      new Field(Type.Head, 1, 0, 'head-right');
  }

  /* ==========================================================
     Snake bewegen (komplette Original-Logik)
  ========================================================== */

  moveSnake(x: number, y: number): void {

    let tail: Field = this.table[this.snakeTailY][this.snakeTailX];

    if (
      (x != 0 && y == 0 || x == 0 && y != 0) &&
      this.snakeTailX + tail.direction_x < this.cols &&
      this.snakeTailY + tail.direction_y < this.rows &&
      this.snakeHeadX + x < this.cols &&
      this.snakeHeadY + y < this.rows &&
      this.snakeHeadX + x >= 0 &&
      this.snakeHeadY + y >= 0 &&
      (
        this.table[this.snakeHeadY + y][this.snakeHeadX + x].type == Type.Empty ||
        this.table[this.snakeHeadY + y][this.snakeHeadX + x].type == Type.Food
      )
    ) {

      /* ==========================================
         Kein Food → Tail verschieben
      ========================================== */

      if (this.table[this.snakeHeadY + y][this.snakeHeadX + x].type != Type.Food) {

        this.table[this.snakeTailY][this.snakeTailX] =
          new Field(Type.Empty, 0, 0, 'empty');

        this.table[this.snakeTailY + tail.direction_y][this.snakeTailX + tail.direction_x].type =
          Type.Tail;

        let newTail: Field =
          this.table[this.snakeTailY + tail.direction_y][this.snakeTailX + tail.direction_x];

        if (newTail.direction_x == 1 && newTail.direction_y == 0)
          this.table[this.snakeTailY + tail.direction_y][this.snakeTailX + tail.direction_x].part = 'tail-right';

        if (newTail.direction_x == -1 && newTail.direction_y == 0)
          this.table[this.snakeTailY + tail.direction_y][this.snakeTailX + tail.direction_x].part = 'tail-left';

        if (newTail.direction_x == 0 && newTail.direction_y == 1)
          this.table[this.snakeTailY + tail.direction_y][this.snakeTailX + tail.direction_x].part = 'tail-down';

        if (newTail.direction_x == 0 && newTail.direction_y == -1)
          this.table[this.snakeTailY + tail.direction_y][this.snakeTailX + tail.direction_x].part = 'tail-up';

        this.snakeTailX += tail.direction_x;
        this.snakeTailY += tail.direction_y;
      }
      else {
        /* ==========================================
           Food gefressen
        ========================================== */
        this.spawnFruit();
        this.score++;
      }

      /* ==========================================
         Alten Head zu Body machen
      ========================================== */

      let bodyOld: Field = this.table[this.snakeHeadY][this.snakeHeadX];

      this.table[this.snakeHeadY][this.snakeHeadX] =
        new Field(Type.Body, x, y, '');

      /* Corner-Logik (unverändert) */

      if (bodyOld.direction_x == 1 && y == -1 || bodyOld.direction_y == 1 && x == -1)
        this.table[this.snakeHeadY][this.snakeHeadX].part = 'corner-dl';

      if (bodyOld.direction_x == 1 && y == 1 || bodyOld.direction_y == -1 && x == -1)
        this.table[this.snakeHeadY][this.snakeHeadX].part = 'corner-ul';

      if (bodyOld.direction_x == -1 && y == -1 || bodyOld.direction_y == 1 && x == 1)
        this.table[this.snakeHeadY][this.snakeHeadX].part = 'corner-ur';

      if (bodyOld.direction_x == -1 && y == 1 || bodyOld.direction_y == -1 && x == 1)
        this.table[this.snakeHeadY][this.snakeHeadX].part = 'corner-dr';

      if (bodyOld.direction_x == 0 && x == 0)
        this.table[this.snakeHeadY][this.snakeHeadX].part = 'body-vertical';

      if (bodyOld.direction_y == 0 && y == 0)
        this.table[this.snakeHeadY][this.snakeHeadX].part = 'body-horizontal';

      /* ==========================================
         Neuen Head setzen
      ========================================== */

      this.table[this.snakeHeadY + y][this.snakeHeadX + x] =
        new Field(Type.Head, x, y, '');

      if (x == 1 && y == 0)
        this.table[this.snakeHeadY + y][this.snakeHeadX + x].part = 'head-right';

      if (x == -1 && y == 0)
        this.table[this.snakeHeadY + y][this.snakeHeadX + x].part = 'head-left';

      if (x == 0 && y == 1)
        this.table[this.snakeHeadY + y][this.snakeHeadX + x].part = 'head-down';

      if (x == 0 && y == -1)
        this.table[this.snakeHeadY + y][this.snakeHeadX + x].part = 'head-up';

      this.snakeHeadX += x;
      this.snakeHeadY += y;
    }
    else {

      clearInterval(this.gameIntervalId);

      if (this.score > this.bestScore)
        this.bestScore = this.score;
    }
  }

  /* ==========================================================
     Steuerung
  ========================================================== */

  moveUp(): void {
    if (this.directionY == 1) return;
    this.directionX = 0;
    this.directionY = -1;
  }

  moveDown(): void {
    if (this.directionY == -1) return;
    this.directionX = 0;
    this.directionY = 1;
  }

  moveLeft(): void {
    if (this.directionX == 1) return;
    this.directionX = -1;
    this.directionY = 0;
  }

  moveRight(): void {
    if (this.directionX == -1) return;
    this.directionX = 1;
    this.directionY = 0;
  }

  /* ==========================================================
     Zufällige Frucht erzeugen
  ========================================================== */

  spawnFruit(): void {

    let x: number;
    let y: number;

    do {
      x = Math.floor(Math.random() * this.cols);
      y = Math.floor(Math.random() * this.rows);
    } while (this.table[y][x].type != Type.Empty);

    let fruit = Math.floor(Math.random() * 8);

    this.table[y][x] =
      new Field(Type.Food, 0, 0, 'fruit-cherry');

    if (fruit == 0) this.table[y][x].part = 'fruit-apple';
    if (fruit == 1) this.table[y][x].part = 'fruit-banana';
    if (fruit == 2) this.table[y][x].part = 'fruit-carrot';
    if (fruit == 3) this.table[y][x].part = 'fruit-cherry';
    if (fruit == 4) this.table[y][x].part = 'fruit-grape';
    if (fruit == 5) this.table[y][x].part = 'fruit-orange';
    if (fruit == 6) this.table[y][x].part = 'fruit-peach';
    if (fruit == 7) this.table[y][x].part = 'fruit-strawberry';
  }
}