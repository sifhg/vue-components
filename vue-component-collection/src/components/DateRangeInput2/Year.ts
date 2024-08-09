import Month from "./Month";

class Year {
  private _year: number;
  private _months: Month[];
  private _width: number;
  constructor(year: number, startDate: Date, endDate: Date) {
    this._year = year;
    this._months = (() => {
      const MONTHS_ARRAY: Month[] = [];
      let iDate = new Date(startDate.getFullYear(), startDate.getMonth());
      while (iDate <= endDate) {
        MONTHS_ARRAY.push(
          new Month(iDate.getMonth(), iDate.getFullYear(), startDate, endDate)
        );
        iDate.setMonth(iDate.getMonth() + 1);
      }
      return MONTHS_ARRAY;
    })();

    this._width = 0;
    this._months.forEach((MONTH) => {
      this._width += MONTH.width;
    });
  }

  display(x: number, y: number, unitSize: number) {}

  get year(): number {
    return this._year;
  }
  get width(): number {
    return this._width;
  }
}
