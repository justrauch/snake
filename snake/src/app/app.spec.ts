import { Component } from '@angular/core';

@Component({
  selector: 'board',
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class BoardComponent {
  rows = Array.from({ length: 10 });
  cols = Array.from({ length: 10 });

  trackByIndex(index: number) {
    return index;
  }
}