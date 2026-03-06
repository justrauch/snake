export class Field {
  type: number;
  is_revealed: boolean;
  
  constructor(type: number, is_revealed: boolean) {
    this.type = type;
    this.is_revealed = is_revealed;
  }
}