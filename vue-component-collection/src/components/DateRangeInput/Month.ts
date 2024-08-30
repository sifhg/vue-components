import Day from "./Day";
import { createColour, PGCanvas, PGShape, PGVector } from "./GoodCanvas/index";
import { _daysIn, _getCutoffIndex } from "./supportFunctions";

class Month {
  private _month: [number, number];
  private _days: Day[];
  private _width: number;
  private _height: number;
  private _x: number;
  private _PGsquare: PGShape | undefined | null;
  private _selected: boolean;
  private _hover: boolean;
  constructor(
    month: number = 0,
    year: number,
    startDate: Date,
    endDate: Date,
    unitSize: PGVector,
    x: number
  ) {
    this._month = [month, year];
    this._x = x;
    if (this._month[0] === undefined) {
      this._month[0] = 0;
    }

    const FIRST_DAY: Day = (() => {
      if (month === startDate.getMonth() && year === startDate.getFullYear()) {
        return new Day(startDate.getDate() - 1, unitSize, this._x);
      }
      return new Day(0, unitSize, this._x);
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
      this._days.push(
        new Day(FIRST_DAY.day + d, unitSize, this._x + d * unitSize.x)
      );
    }

    this._width = 0;
    this._days.forEach((DAY) => {
      this._width += DAY.width;
    });
    this._height = unitSize.y;
    this._selected = false;
    this._hover = false;
  }

  public display(
    canvas: PGCanvas,
    displayFineness: Set<"days" | "months" | "years">,
    xVisible0: number,
    xVisible1: number
  ) {
    if (displayFineness.has("months")) {
      this._PGsquare = canvas.createRect(
        this._x,
        displayFineness.has("days") ? this._height : 0,
        this._width,
        this._height
      );
      this._PGsquare.colour = this._selected
        ? createColour("RGB", 0, 0, 255)
        : createColour("GREYSCALE", 223);

      this._PGsquare.borderRadius = this._height / 3;
    } else {
      this._PGsquare = null;
    }
    if (displayFineness.has("days")) {
      const DISPLAY_DAYS: Array<Day> = (() => {
        let slicedArray: Array<Day> = [...this._days];
        if (this._x < xVisible0) {
          slicedArray = slicedArray.slice(
            _getCutoffIndex(slicedArray, (day) => day.x + day.width > xVisible0)
          );
        }
        if (this._x + this._width > xVisible1) {
          slicedArray = slicedArray.slice(
            0,
            _getCutoffIndex(slicedArray, (day) => day.x > xVisible1)
          );
        }
        return slicedArray;
      })();
      DISPLAY_DAYS.forEach((day) => {
        day.display(canvas, displayFineness, xVisible0, xVisible1);
      });
    }
  }

  public select(): void {
    this._selected = true;
    this._days.forEach((day) => {
      day.select();
    });
  }
  public deselect(): void {
    this._selected = false;
  }
  public deselectAll(): void {
    this._days.forEach((day) => {
      day.deselect();
    });
  }
  public mouseEnter(): void {
    this._hover = true;
  }
  public mouseLeave(): void {
    this._hover = false;
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
    return this._x;
  }
}

export default Month;
