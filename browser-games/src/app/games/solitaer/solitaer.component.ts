import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Color } from './models/Color';
import { Field } from './models/Field';
import { Group } from './models/Group';
import { Type } from './models/Type';

@Component({
  selector: 'app-solitaer',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './solitaer.component.html',
  styleUrls: ['./solitaer.component.css']
})
export class SolitaerComponent {

  score: number = 0;
  best_score: number = 0;

  goal: Field[][] = [];

  active: Field[] = [];

  board: Field[][] = []

  deck: Field[] = [];

  constructor(private cd: ChangeDetectorRef) {
    this.reset();
  }

  reset(){
    this.score = 0;

    this.goal = [[new Field(Type.Null, Group.Clubs, Color.Black)], [new Field(Type.Null, Group.Spades, Color.Black)], [new Field(Type.Null, Group.Diamonds, Color.Red)], [new Field(Type.Null, Group.Hearts, Color.Red)]]

    this.active = [];

    this.board = []

    this.deck = [
      // Clubs (Kreuz) – Schwarz
      new Field(Type.King, Group.Clubs, Color.Black),
      new Field(Type.Queen, Group.Clubs, Color.Black),
      new Field(Type.Jack, Group.Clubs, Color.Black),
      new Field(Type.Ten, Group.Clubs, Color.Black),
      new Field(Type.Nine, Group.Clubs, Color.Black),
      new Field(Type.Eight, Group.Clubs, Color.Black),
      new Field(Type.Seven, Group.Clubs, Color.Black),
      new Field(Type.Six, Group.Clubs, Color.Black),
      new Field(Type.Five, Group.Clubs, Color.Black),
      new Field(Type.Four, Group.Clubs, Color.Black),
      new Field(Type.Three, Group.Clubs, Color.Black),
      new Field(Type.Two, Group.Clubs, Color.Black),
      new Field(Type.Ass, Group.Clubs, Color.Black),

      // Spades (Pik) – Schwarz
      new Field(Type.King, Group.Spades, Color.Black),
      new Field(Type.Queen, Group.Spades, Color.Black),
      new Field(Type.Jack, Group.Spades, Color.Black),
      new Field(Type.Ten, Group.Spades, Color.Black),
      new Field(Type.Nine, Group.Spades, Color.Black),
      new Field(Type.Eight, Group.Spades, Color.Black),
      new Field(Type.Seven, Group.Spades, Color.Black),
      new Field(Type.Six, Group.Spades, Color.Black),
      new Field(Type.Five, Group.Spades, Color.Black),
      new Field(Type.Four, Group.Spades, Color.Black),
      new Field(Type.Three, Group.Spades, Color.Black),
      new Field(Type.Two, Group.Spades, Color.Black),
      new Field(Type.Ass, Group.Spades, Color.Black),

      // Hearts – Rot
      new Field(Type.King, Group.Hearts, Color.Red),
      new Field(Type.Queen, Group.Hearts, Color.Red),
      new Field(Type.Jack, Group.Hearts, Color.Red),
      new Field(Type.Ten, Group.Hearts, Color.Red),
      new Field(Type.Nine, Group.Hearts, Color.Red),
      new Field(Type.Eight, Group.Hearts, Color.Red),
      new Field(Type.Seven, Group.Hearts, Color.Red),
      new Field(Type.Six, Group.Hearts, Color.Red),
      new Field(Type.Five, Group.Hearts, Color.Red),
      new Field(Type.Four, Group.Hearts, Color.Red),
      new Field(Type.Three, Group.Hearts, Color.Red),
      new Field(Type.Two, Group.Hearts, Color.Red),
      new Field(Type.Ass, Group.Hearts, Color.Red),

      // Diamonds – Rot
      new Field(Type.King, Group.Diamonds, Color.Red),
      new Field(Type.Queen, Group.Diamonds, Color.Red),
      new Field(Type.Jack, Group.Diamonds, Color.Red),
      new Field(Type.Ten, Group.Diamonds, Color.Red),
      new Field(Type.Nine, Group.Diamonds, Color.Red),
      new Field(Type.Eight, Group.Diamonds, Color.Red),
      new Field(Type.Seven, Group.Diamonds, Color.Red),
      new Field(Type.Six, Group.Diamonds, Color.Red),
      new Field(Type.Five, Group.Diamonds, Color.Red),
      new Field(Type.Four, Group.Diamonds, Color.Red),
      new Field(Type.Three, Group.Diamonds, Color.Red),
      new Field(Type.Two, Group.Diamonds, Color.Red),
      new Field(Type.Ass, Group.Diamonds, Color.Red),
    ];

    this.initTable();
  }

  initTable(): void {
    this.deck = this.shuffle(this.deck);

    this.board = [];

    for (let i = 0; i < 7; i++) {

      const column: Field[] = [];

      for (let j = 0; j <= i; j++) {
        const card = this.deck.pop();
        if (card) {
          if (j == i){
            card.flipped = true;
          }
          column.push(card);
        }
      }

      this.board.push(column);
    }
  }

  shuffle<T>(array: T[]): T[] {
    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
  }

  newCard(): void {
    if (this.deck.length >= 1) {
      const card = this.deck.pop(); 
      if (card) { 
        card.flipped = true; 
        this.active.push(card);
      }
    } else {
      this.deck = [...this.active].reverse();
      this.active = [];
    }

    this.score++;
  }

  tryCard(x: number, y: number, is_goal: boolean = false): void {
    console.log("hello");
    let card = y == -1 ? 
      this.active.at(-1) :
      is_goal ? 
      this.goal[x][y] : 
      this.board[x][y];

    let moved = false;

    if (card)
    {
      if (!is_goal)
      {
        for (let i = 0; i <= 3; i++) {
          const lastCard = this.goal[i].at(-1);
          if (lastCard && lastCard.group === card.group && !(y > 0 && (y) === this.board[x].length)) {
            if (((lastCard.type || 0) + 1) == card.type){
              card.flipped = true;
              this.goal[i].push(card);
              moved = true;
              break;
            }
          }
        }
      }

      if (!moved){
        for (let i = 0; i < 7; i++) {
          const topCard = this.board[i].at(-1);
          console.log(topCard?.type + "===" + card.type);
          if (
            (topCard && (topCard.type - 1 === card.type && topCard.color !== card.color)) || 
            (!topCard && card.type === 13)) {
            if (is_goal){
              this.board[i].push(card);
              this.goal[x].pop();
            }
            else if (y >= 0) {
              const movedCards = this.board[x].splice(y);
              this.board[i].push(...movedCards);
              const lastCard = this.board[x].at(-1);
              if (lastCard) lastCard.flipped = true;
            } else {
              this.board[i].push(card);
              this.active.pop();
            }
            moved = true;
            break;
          }
        }
      }
      else{
        if (y >= 0){
          this.board[x].pop();
          const lastCard = this.board[x].at(-1);
          if (lastCard) lastCard.flipped = true;
        }
        else if (is_goal){
          this.goal.pop();
        }
        else {
          this.active.pop();
        }
      }

      if (moved) this.score++;

      if (
        this.score > this.best_score && 
        this.active.length === 0 && 
        this.board.every(inner => inner.length === 0)
      ) {
        this.best_score = this.score;
      }
    }
  }
}
