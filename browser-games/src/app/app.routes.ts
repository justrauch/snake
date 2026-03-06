import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SnakeComponent } from './games/snake/snake.component';
import { SolitaerComponent } from './games/solitaer/solitaer.component';
import { MinesweeperComponent } from './games/minesweeper/minesweeper.component';
import { Component } from '@angular/core';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'snake', component: SnakeComponent },
  { path: 'solitaer', component: SolitaerComponent },
  { path: 'minesweeper', component: MinesweeperComponent}
];
