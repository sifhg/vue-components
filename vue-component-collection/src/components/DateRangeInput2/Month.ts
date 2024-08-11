import Day from "./Day";
import { _daysIn } from "./supportFunctions";

class Month {
  private _month: [number, number];
  private _days: Day[];
  private _width: number;
  constructor(
    month: number,
    year: number,
    startDate: Date,
    endDate: Date,
    unitSize: number
  ) {
    this._month = [month, year];

    const FIRST_DAY: Day = (() => {
      if (month === startDate.getMonth() && year === startDate.getFullYear()) {
        return new Day(startDate.getDate(), unitSize);
      }
      return new Day(0, unitSize);
    })();

    this._days = [FIRST_DAY];
    const NUMBER_OF_DAYS: number = (() => {
      let dayNumber = _daysIn(year, month);
      if (month === startDate.getMonth() && year === startDate.getFullYear()) {
        dayNumber -= startDate.getDate();
      }
      if (month === endDate.getMonth() && year === endDate.getFullYear()) {
        dayNumber -= dayNumber - endDate.getDate();
      }
      return dayNumber;
    })();

    for (let d = 1; d < NUMBER_OF_DAYS; d++) {
      this._days.push(new Day(FIRST_DAY.day + d, unitSize));
    }

    this._width = 0;
    this._days.forEach((DAY) => {
      this._width += DAY.width;
    });
  }
  get width(): number {
    return this._width;
  }
}

export default Month;
