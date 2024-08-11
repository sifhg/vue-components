class Day {
  private _day: number;
  private _width: number;
  constructor(day: number, unitSize: number) {
    this._day = day;
    this._width = unitSize;
  }
  get width(): number {
    return this._width;
  }
  get day(): number {
    return this._day;
  }
}

export default Day;
