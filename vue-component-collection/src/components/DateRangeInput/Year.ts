import { createColour, PGCanvas, PGShape, PGVector } from "./GoodCanvas/index";
import Month from "./Month";
import { _getCutoffIndex } from "./supportFunctions";

class Year {
  private _year: number;
  private _months: Month[];
  private _x: number;
  private _width: number;
  private _height: number;
  private _PGsquare: PGShape | undefined | null;
  private _selected: boolean;
  private _hover: boolean;
  constructor(
    year: number,
    startDate: Date,
    endDate: Date,
    unitSize: PGVector,
    x: number,
    displayFineness?: Array<"days" | "months" | "years">
  ) {
    this._year = year;
    this._x = x;
    this._months = (() => {
      let iDate: Date;
      if (this._year === startDate.getFullYear()) {
        iDate = new Date(this._year, startDate.getMonth());
      } else {
        iDate = new Date(this._year, 0);
      }
      const MONTHS_ARRAY: Month[] = [
        new Month(
          iDate.getMonth(),
          iDate.getFullYear(),
          startDate,
          endDate,
          unitSize,
          this._x
        ),
      ];
      iDate.setMonth(iDate.getMonth() + 1);
      while (iDate <= endDate && iDate.getMonth() !== 0) {
        const PAST_MONTH = MONTHS_ARRAY[MONTHS_ARRAY.length - 1];
        MONTHS_ARRAY.push(
          new Month(
            iDate.getMonth(),
            iDate.getFullYear(),
            startDate,
            endDate,
            unitSize,
            PAST_MONTH.x + PAST_MONTH.width
          )
        );
        iDate.setMonth(iDate.getMonth() + 1);
      }
      return MONTHS_ARRAY;
    })();

    this._width = 0;
    this._months.forEach((MONTH) => {
      this._width += MONTH.width;
    });
    this._height = unitSize.y;
    this._selected = false;
    this._hover = false;
  }

  /**
   * Update the PGsquare of this year and adds that PGsquare to the canvas. Also
   * @param {PGCanvas} canvas - the canvas to which, the PGsquare will be added.
   * @param {Set<"days" | "months" | "years">} displayFineness - a set of the categories of calendar entities you wish to display to the canvas.
   */
  public display(
    canvas: PGCanvas,
    displayFineness: Set<"days" | "months" | "years">,
    xVisible0: number,
    xVisible1: number
  ) {
    if (displayFineness.has("years")) {
      const X = this._x;
      const Y = (displayFineness.size - 1) * this._height;

      this._PGsquare = canvas.createRect(X, Y, this._width, this._height);
      this._PGsquare.colour = createColour("GREYSCALE", 223);
      if (this._hover) {
        this._PGsquare.colour = createColour("RGB", 255, 0, 0);
      }
      if (this._selected) {
        this._PGsquare.colour = createColour("RGB", 0, 0, 255);
      }

      this._PGsquare.borderRadius = this._height / 3;
    } else {
      this._PGsquare = null;
    }
    if (displayFineness.has("months")) {
      const DISPLAY_MONTHS: Array<Month> = (() => {
        let slicedArray: Array<Month> = [...this._months];
        if (this._x < xVisible0) {
          slicedArray = slicedArray.slice(
            _getCutoffIndex(
              this._months,
              (month: Month) => month.x + month.width > xVisible0
            )
          );
        }
        if (this._x + this._width > xVisible1) {
          slicedArray = slicedArray.slice(
            0,
            _getCutoffIndex(this._months, (month: Month) => month.x > xVisible1)
          );
        }
        return slicedArray;
      })();
      DISPLAY_MONTHS.forEach((month) => {
        month.display(canvas, displayFineness, xVisible0, xVisible1);
      });
    }
    canvas.render(true);
  }

  public destructSquare() {
    this._PGsquare = undefined;
  }

  public select(): void {
    this._selected = true;
    this._months.forEach((month) => {
      month.select();
    });
  }
  public deselect(): void {
    this._selected = false;
  }
  public deselectAll(): void {
    this.deselect();
    this._months.forEach((month) => {
      month.deselect();
    });
  }
  public mouseEnter(): void {
    this._hover = true;
  }
  public mouseLeave(): void {
    this._hover = false;
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
