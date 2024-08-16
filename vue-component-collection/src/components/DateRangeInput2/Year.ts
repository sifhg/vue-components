import { PGCanvas, PGShape } from "./GoodCanvas/index";
import Month from "./Month";

class Year {
  private _year: number;
  private _months: Month[];
  private _width: number;
  private _unitSize: number;
  private _square: PGShape | undefined | null;
  constructor(
    year: number,
    startDate: Date,
    endDate: Date,
    unitSize: number,
    displayFineness?: Array<"days" | "months" | "years">
  ) {
    this._year = year;
    this._months = (() => {
      const MONTHS_ARRAY: Month[] = [];
      let iDate = new Date(startDate.getFullYear(), startDate.getMonth());
      while (iDate <= endDate) {
        MONTHS_ARRAY.push(
          new Month(
            iDate.getMonth(),
            iDate.getFullYear(),
            startDate,
            endDate,
            unitSize
          )
        );
        iDate.setMonth(iDate.getMonth() + 1);
      }
      return MONTHS_ARRAY;
    })();

    this._width = 0;
    this._unitSize = unitSize;
    this._months.forEach((MONTH) => {
      this._width += MONTH.width;
    });
  }

  public display(
    x: number,
    y: number,
    canvas: PGCanvas,
    displayFineness: Set<"days" | "months" | "years">
  ) {
    if (displayFineness.has("years")) {
      if (!this._square) {
        this._square = canvas.createRect(x, y, this._width, this._unitSize);
      } else {
        this._square.x = x;
        this._square.y = y;
      }
    } else {
      this._square = null;
    }
    if (displayFineness.has("months")) {
      this._months.forEach((month, index) => {
        month.display(
          x + this._unitSize * index,
          y - this._unitSize,
          canvas,
          displayFineness
        );
      });
    } else if (displayFineness.has("days")) {
      this._months.forEach((month) => {
        month.days.forEach((day, index) => {
          day.display(x + this._unitSize * index, y - this._unitSize, canvas);
        });
      });
    }
    canvas.render(true);
  }

  public get year(): number {
    return this._year;
  }
  public get width(): number {
    return this._width;
  }
}
