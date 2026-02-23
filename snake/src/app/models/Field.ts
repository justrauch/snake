import { Type } from './Type';

export class Field {
  type: Type;
  direction_x: number;
  direction_y: number;
  part: string;

  constructor(type: Type, direction_x: number, direction_y: number, part: string) {
    this.type = type;
    this.direction_x = direction_x;
    this.direction_y = direction_y;
    this.part = part;
  }
}