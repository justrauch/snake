
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
    this.generatetable();
    this.initsnake();
    setInterval(() => {
      this.movesnake(this.moveX, this.moveY);
      this.cd.detectChanges();
    }, 500);
  }

  generatetable() {
    this.table = Array.from({ length: this.rows }, (_, i) =>
      Array.from({ length: this.cols }, (_, j) => new Field(Type.Empty, 0, 0, ""))
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
      this.table[this.snake_head_y + y][this.snake_head_x + x].type != Type.Empty ||
      this.table[this.snake_head_y + y][this.snake_head_x + x].type != Type.Food
    )
    {
      this.table[this.snake_tail_y][this.snake_tail_x] = new Field(Type.Empty, 0, 0, "");
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
  }

    moveUp() {
    this.moveX = 0;
    this.moveY = -1;
  }

  moveDown() {
    this.moveX = 0;
    this.moveY = 1;
  }

  moveLeft() {
    this.moveX = -1;
    this.moveY = 0;
  }

  moveRight() {
    this.moveX = 1;
    this.moveY = 0;
  }
}