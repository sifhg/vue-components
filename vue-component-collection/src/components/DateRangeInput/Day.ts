import { createColour, PGCanvas, PGShape } from "./GoodCanvas";

class Day {
  private _day: number;
  private _width: number;
  private _unitSize: number;
  private _square: PGShape | undefined | null;
  constructor(day: number, unitSize: number) {
    this._day = day;
    this._width = unitSize;
    this._unitSize = unitSize;
  }

  public display(x: number, y: number, canvas: PGCanvas) {
    if (this._square === undefined || this._square === null) {
      this._square = canvas.createRect(x, y, this._width, this._unitSize);
      this._square.colour = createColour("GREYSCALE", 192);
      this._square.setStroke(1, createColour("GREYSCALE", 0));
      this._square.borderRadius = this._unitSize / 3;
    } else {
      this._square.x = x;
      this._square.y = y;
    }
  }

  public get width(): number {
    return this._width;
  }
  public get day(): number {
    return this._day;
  }
}

export default Day;
