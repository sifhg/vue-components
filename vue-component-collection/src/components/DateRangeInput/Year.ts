import { createColour, PGCanvas, PGShape, PGVector } from "./GoodCanvas/index";
import Month from "./Month";

class Year {
  private _year: number;
  private _months: Month[];
  private _x: number;
  private _width: number;
  private _height: number;
  private _PGsquare: PGShape | undefined | null;
  constructor(
    year: number,
    startDate: Date,
    endDate: Date,
    unitSize: PGVector,
    x: number,
    displayFineness?: Array<"days" | "months" | "years">
  ) {
    this._year = year;
    this._months = (() => {
      const MONTHS_ARRAY: Month[] = [];
      let iDate: Date;
      if (this._year === startDate.getFullYear()) {
        iDate = new Date(this._year, startDate.getMonth());
      } else {
        iDate = new Date(this._year, 0);
      }
      do {
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
      } while (iDate <= endDate && iDate.getMonth() !== 0);
      return MONTHS_ARRAY;
    })();

    this._x = x;
    this._width = 0;
    this._months.forEach((MONTH) => {
      this._width += MONTH.width;
    });
    this._height = unitSize.y;
  }

  /**
   * Update the PGsquare of this year and adds that PGsquare to the canvas. Also
   * @param {PGCanvas} canvas - the canvas to which, the PGsquare will be added.
   * @param {Set<"days" | "months" | "years">} displayFineness - a set of the categories of calendar entities you wish to display to the canvas.
   */
  public display(
    canvas: PGCanvas,
    displayFineness: Set<"days" | "months" | "years">
  ) {
    if (displayFineness.has("years")) {
      const X = this._x;
      const Y = (displayFineness.size - 1) * this._height;

      this._PGsquare = canvas.createRect(X, Y, this._width, this._height);
      this._PGsquare.colour = createColour("RGB", 225, 0, 33);
      this._PGsquare.setStroke(1, createColour("GREYSCALE", 0));
      this._PGsquare.borderRadius = this._height / 3;
    } else {
      this._PGsquare = null;
    }
    let monthX = this._PGsquare!.x;
    // if (displayFineness.has("months")) {
    //   this._months.forEach((month) => {
    //     month.display(monthX, y - this._height, canvas, displayFineness);
    //     monthX += month.width;
    //   });
    // } else if (displayFineness.has("days")) {
    //   this._months.forEach((month) => {
    //     month.days.forEach((day, index) => {
    //       day.display(x + day.width * index, y - this._height, canvas);
    //     });
    //   });
    // }
    canvas.render(true);
  }

  public destructSquare() {
    this._PGsquare = undefined;
  }

  public get months(): Month[] {
    return [...this._months];
  }
  public get width(): number {
    return this._width;
  }
  public get x(): number {
    return this._x;
  }
  public get year(): number {
    return this._year;
  }

  public set x(newX: number) {
    this._x = newX;
  }
}

export default Year;
