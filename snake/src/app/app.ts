
import { ChangeDetectorRef } from '@angular/core';
import { Component } from '@angular/core';
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
  rows = 20;
  cols = 20;

  snake_tail_x = 0;
  snake_tail_y = 0;

  snake_length = 10;
  
  snake_head_x = this.snake_length + 1;
  snake_head_y = 0;

  moveX = 1;
  moveY = 0;

  intervalId: any;

  table: Field[][] = [];

  constructor(private cd: ChangeDetectorRef) {
  }

  reset(){
    clearInterval(this.intervalId);

    this.snake_tail_x = 0;
    this.snake_tail_y = 0;

    this.snake_length = 3;
    
    this.snake_head_x = this.snake_length + 1;
    this.snake_head_y = 0;

    this.moveX = 1;
    this.moveY = 0;

    this.generatetable();
    this.initsnake();
    this.spawnFruit();
  }

  startGame(){
    this.intervalId = setInterval(() => {
      this.movesnake(this.moveX, this.moveY);
      this.cd.detectChanges();
    }, 200);
  }

  generatetable() {
    this.table = Array.from({ length: this.rows }, (_, i) =>
      Array.from({ length: this.cols }, (_, j) => new Field(Type.Empty, 0, 0, "empty"))
    );
  }
  
  initsnake(){
    this.table[this.snake_tail_y][this.snake_tail_x] = new Field(Type.Tail, 1, 0, "tail-right");
    for (let i = 1; i <= this.snake_length; i++) {
      this.table[this.snake_tail_y][this.snake_tail_x + i] = new Field(Type.Body, 1, 0, "body-horizontal");
    }
    this.table[this.snake_tail_y][this.snake_tail_x + this.snake_length + 1] = new Field(Type.Head, 1, 0, "head-right");
  }

  movesnake(x: number, y: number){
    let tail: Field = this.table[this.snake_tail_y][this.snake_tail_x];
    if (
      (x != 0 && y == 0 || x == 0 && y != 0) &&
      this.snake_tail_x + tail.direction_x < 20 && this.snake_tail_y + tail.direction_y < 20 && 
      this.snake_head_x + x < 20 && this.snake_head_y + y < 20 && 
      this.snake_head_x + x >= 0 && this.snake_head_y + y >= 0 &&
      (this.table[this.snake_head_y + y][this.snake_head_x + x].type == Type.Empty ||
      this.table[this.snake_head_y + y][this.snake_head_x + x].type == Type.Food)
    )
    {
      if (this.table[this.snake_head_y + y][this.snake_head_x + x].type != Type.Food)
      {
        this.table[this.snake_tail_y][this.snake_tail_x] = new Field(Type.Empty, 0, 0, "empty");
        this.table[this.snake_tail_y + tail.direction_y][this.snake_tail_x + tail.direction_x].type = Type.Tail;
        let new_tail: Field = this.table[this.snake_tail_y + tail.direction_y][this.snake_tail_x + tail.direction_x]
        if (new_tail.direction_x == 1 && new_tail.direction_y == 0){
          this.table[this.snake_tail_y + tail.direction_y][this.snake_tail_x + tail.direction_x].part = "tail-right";
        }
        if (new_tail.direction_x == -1 && new_tail.direction_y == 0){
          this.table[this.snake_tail_y + tail.direction_y][this.snake_tail_x + tail.direction_x].part = "tail-left";
        }
        if (new_tail.direction_x == 0 && new_tail.direction_y == 1){
          this.table[this.snake_tail_y + tail.direction_y][this.snake_tail_x + tail.direction_x].part = "tail-down";
        }
        if (new_tail.direction_x == 0 && new_tail.direction_y == -1){
          this.table[this.snake_tail_y + tail.direction_y][this.snake_tail_x + tail.direction_x].part = "tail-up";
        }
        this.snake_tail_x = this.snake_tail_x + tail.direction_x;
        this.snake_tail_y = this.snake_tail_y + tail.direction_y;
      }
      else {
        this.spawnFruit();
      }
      let body_old: Field = this.table[this.snake_head_y][this.snake_head_x];
      this.table[this.snake_head_y][this.snake_head_x] = new Field(Type.Body, x, y, "");
      if (body_old.direction_x == 1 && y == -1 || body_old.direction_y == 1 && x == -1){
        this.table[this.snake_head_y][this.snake_head_x].part = "corner-dl";
      }
      if (body_old.direction_x == +1 && y == +1 || body_old.direction_y == -1 && x == -1){
        this.table[this.snake_head_y][this.snake_head_x].part = "corner-ul";
      }
      if (body_old.direction_x == -1 && y == -1 || body_old.direction_y == +1 && x == 1){
        this.table[this.snake_head_y][this.snake_head_x].part = "corner-ur";
      }
      if (body_old.direction_x == -1 && y == +1 || body_old.direction_y == -1 && x == 1){
        this.table[this.snake_head_y][this.snake_head_x].part = "corner-dr";
      }
      if (body_old.direction_x == 0 && x == 0){
        this.table[this.snake_head_y][this.snake_head_x].part = "body-vertical";
      }
      if (body_old.direction_y == 0 && y == 0){
        this.table[this.snake_head_y][this.snake_head_x].part = "body-horizontal";
      }
      this.table[this.snake_head_y + y][this.snake_head_x + x] = new Field(Type.Head, x, y, "");
      if (x == 1 && y == 0){
        this.table[this.snake_head_y + y][this.snake_head_x + x].part = "head-right";
      }
      if (x == -1 && y == 0){
        this.table[this.snake_head_y + y][this.snake_head_x + x].part = "head-left";
      }
      if (x == 0 && y == 1){
        this.table[this.snake_head_y + y][this.snake_head_x + x].part = "head-down";
      }
      if (x == 0 && y == -1){
        this.table[this.snake_head_y + y][this.snake_head_x + x].part = "head-up";
      }
      this.snake_head_x = this.snake_head_x + x;
      this.snake_head_y = this.snake_head_y + y;
    }
    else {
      clearInterval(this.intervalId);
    }
  }

  moveUp() {
    if (this.moveY == 1) return;
    this.moveX = 0;
    this.moveY = -1;
  }

  moveDown() {
    if (this.moveY == -1) return;
    this.moveX = 0;
    this.moveY = 1;
  }

  moveLeft() {
    if (this.moveX == 1) return;
    this.moveX = -1;
    this.moveY = 0;
  }

  moveRight() {
    if (this.moveX == -1) return;
    this.moveX = 1;
    this.moveY = 0;
  }

  spawnFruit() {
    let x: number;
    let y: number;

    do {
      x = Math.floor(Math.random() * this.cols);
      y = Math.floor(Math.random() * this.rows);
      console.log(x + " " + y);
    } while (this.table[y][x].type != Type.Empty);

    let fruit = Math.floor(Math.random() * 8);
    this.table[y][x] = new Field(Type.Food, 0, 0, "fruit-cherry");

    if (fruit == 0) this.table[y][x].part = "fruit-apple";
    if (fruit == 1) this.table[y][x].part = "fruit-banana";
    if (fruit == 2) this.table[y][x].part = "fruit-carrot";
    if (fruit == 3) this.table[y][x].part = "fruit-cherry";
    if (fruit == 4) this.table[y][x].part = "fruit-grape";
    if (fruit == 5) this.table[y][x].part = "fruit-orange";
    if (fruit == 6) this.table[y][x].part = "fruit-peach";
    if (fruit == 7) this.table[y][x].part = "fruit-strawberry";
  }
}