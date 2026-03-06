import { Type } from './Type';
import { Group } from './Group';
import { Color } from './Color';

export class Field {
  type: Type;
  group: Group;
  color: Color;
  flipped: boolean;
  

  constructor(type: Type, group: Group, color: Color) {
    this.type = type;
    this.group = group;
    this.color = color;
    this.flipped = false;
  }
}