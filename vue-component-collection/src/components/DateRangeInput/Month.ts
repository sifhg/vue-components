import Day from "./Day";
import { createColour, PGCanvas, PGShape, PGVector } from "./GoodCanvas/index";
import { _daysIn } from "./supportFunctions";

class Month {
  private _month: [number, number];
  private _days: Day[];
  private _width: number;
  private _height: number;
  private _PGsquare: PGShape | undefined | null;
  constructor(
    month: number = 0,
    year: number,
    startDate: Date,
    endDate: Date,
    unitSize: PGVector
  ) {
    this._month = [month, year];
    if (this._month[0] === undefined) {
      this._month[0] = 0;
    }

    const FIRST_DAY: Day = (() => {
      if (month === startDate.getMonth() && year === startDate.getFullYear()) {
        return new Day(startDate.getDate() - 1, unitSize);
      }
      return new Day(0, unitSize);
    })();

    this._days = [FIRST_DAY];
    const NUMBER_OF_DAYS: number = (() => {
      let dayNumber = _daysIn(this._month[0], this._month[1]);
      if (month === startDate.getMonth() && year === startDate.getFullYear()) {
        dayNumber -= startDate.getDate() - 1;
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
    this._height = unitSize.y;
  }

  public display(
    x: number,
    y: number,
    canvas: PGCanvas,
    displayFineness: Set<"days" | "months" | "years">
  ) {
    if (displayFineness.has("months")) {
      this._PGsquare = canvas.createRect(x, y, this._width, this._height);
      this._PGsquare.colour = createColour("RGB", 33, 200, 192);
      this._PGsquare.setStroke(1, createColour("GREYSCALE", 0));
      this._PGsquare.borderRadius = this._height / 3;
    }
    if (displayFineness.has("days")) {
      this._days.forEach((day, index) => {
        day.display(x + day.width * index, y - this._height, canvas);
      });
    }
  }

  public toString(): [string, object] {
    return [`[${this._month[0]}, ${this._month[1]}]`, { days: this._days }];
  }

  public get days(): Array<Day> {
    return [...this._days];
  }
  public get month(): [number, number] {
    return [...this._month];
  }
  public get width(): number {
    return this._width;
  }
  public get x(): number {
    if (this._PGsquare) {
      return this._PGsquare.x;
    }
    throw new Error(`This Month instance has no PGShape member.`);
  }
}

export default Month;
