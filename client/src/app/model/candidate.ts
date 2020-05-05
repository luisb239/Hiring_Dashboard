export class Candidate {
  private _cv: string;
  get cv(): string {
    return this._cv;
  }

  set cv(value: string) {
    this._cv = value;
  }

  private _available: boolean;
  get available(): boolean {
    return this._available;
  }

  set available(value: boolean) {
    this._available = value;
  }

  private _profileInfo: string;
  get profileInfo(): string {
    return this._profileInfo;
  }

  set profileInfo(value: string) {
    this._profileInfo = value;
  }

  constructor(public name: string) {
  }
}
