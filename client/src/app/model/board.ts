import { Request } from './request';
import {Column} from './column';
export class Board {
  // constructor(public name: string, public requests: Request[]) {}
  constructor(public name: string, public columns: Column[]) {}
}
