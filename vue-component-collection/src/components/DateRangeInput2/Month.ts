class Month {
  private _month: [number, number];
  private _days: Day[];
  private _width: number;
  constructor(month: number, year: number, startDate: Date, endDate: Date) {
    this._month = [month, year];
  }
  get width(): number {
    return this._width;
  }
}

export default Month;
