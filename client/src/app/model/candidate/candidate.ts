export class Candidate {
  constructor(public name: string,
              public id: number,
              public profileInfo: string = '',
              public available: boolean = true,
              public cv: string = '') {
  }
}
