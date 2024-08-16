import { PGColour } from "./PGColour.js";
import { ColourString, Size } from "../types.js";
import { PGVector } from "./PGVector.js";

type Tag =
  | { tag: "circle"; r: number }
  | { tag: "rect"; size: Size; borderRadius?: number }
  | { tag: "path"; path: Array<PGVector>; closePath?: boolean };
type ShapeConfig = {
  pos: PGVector;
  label?: string;
  colour?: ColourString | PGColour | boolean;
} & Tag;

type StrokeConfig =
  | {
      width?: number;
      colour?: PGColour | ColourString;
    }
  | boolean;

class PGShape {
  private _pos: PGVector;
  private _tag: "circle" | "rect" | "path";
  private _stroke: StrokeConfig;
  private _borderRadius?: number;
  private _closePath?: boolean;
  private _colour?: ColourString | PGColour | boolean;
  private _label?: string;
  private _path?: Array<PGVector>;
  private _radius?: number;
  private _size?: Size;

  constructor(config: ShapeConfig) {
    this._pos = config.pos;
    this._tag = config.tag;
    if (config.tag === "circle") {
      this._radius = config.r;
    }
    if (config.tag === "rect") {
      this._size = config.size;
      this._borderRadius = config.borderRadius;
    }
    if (config.tag === "path") {
      this._path = config.path;
      this._closePath =
        config.closePath !== undefined ? config.closePath : true;
    }
    this._label = config.label;
    this._colour = config.colour;
    this._stroke = false;
  }

  // Getters
  public get borderRadius(): number {
    if (this._tag === "rect") {
      return this._borderRadius ? this._borderRadius : 0;
    }
    throw new Error(`a shape with tag, "${this._tag}",  has no border radius.
        Label: ${this._label}`);
  }

  public get closePath(): boolean {
    if (this._tag !== "path") {
      throw new Error(`a shape with tag, "${this._tag}",  has no closePath setting.
        Label: ${this._label}`);
    }
    if (this._closePath) {
      return this._closePath;
    }
    return false;
  }

  public get colour(): ColourString | PGColour | boolean {
    if (this._colour) {
      return this._colour;
    }
    return false;
  }

  public get h(): number {
    return this.size.h;
  }

  public get height(): number {
    return this.h;
  }

  public get label(): string {
    if (this._label) {
      return this._label;
    }
    return "...none...";
  }

  public get path(): Array<PGVector> {
    if (this._tag === "path") {
      return [...this._path!];
    }
    throw new Error(`a shape with tag, "${this._tag}",  has no path.
        Label: ${this._label}`);
  }

  public get pos(): PGVector {
    return this._pos.clone();
  }

  public get r(): number {
    if (this.tag === "circle") {
      return this._radius!;
    }
    throw new Error(`a shape with tag, "${this._tag}",  has no radius.
        Label: ${this._label}`);
  }

  public get radius(): number {
    return this.r;
  }

  public get size(): Size {
    if (this._tag === "rect") {
      return this._size!;
    }
    throw new Error(`a shape with tag, "${this._tag}",  has no size member.
        Label: ${this._label}`);
  }

  public get stroke(): StrokeConfig {
    return this._stroke;
  }

  public get tag(): "circle" | "rect" | "path" {
    return this._tag;
  }

  public get w(): number {
    return this.size.w;
  }

  public get width(): number {
    return this.w;
  }

  public get x(): number {
    return this._pos.x;
  }

  public get y(): number {
    return this._pos.y;
  }

  // Setters
  public set borderRadius(aBorderRadius: number) {
    this._borderRadius = aBorderRadius;
  }

  public set closePath(close: boolean) {
    if (close) {
      this._closePath = close;
      return;
    }
    this._closePath = false;
  }

  public set colour(aColour: ColourString | PGColour | boolean) {
    this._colour = aColour;
  }

  public set label(aLabel: string) {
    this._label = aLabel;
  }

  public set x(newX: number) {
    this._pos.x = newX;
  }

  public set y(newY: number) {
    this._pos.y = newY;
  }

  public setStroke(strokeWidth: number): void;
  public setStroke(strokeColour: PGColour | ColourString): void;
  public setStroke(
    strokeWidth: number,
    strokeColour: PGColour | ColourString
  ): void;
  public setStroke(showStroke: boolean): void;
  public setStroke(aStroke: StrokeConfig): void;
  public setStroke(
    arg0: number | PGColour | ColourString | boolean | StrokeConfig,
    arg1?: PGColour | ColourString
  ): void {
    if (typeof arg0 === "number") {
      this._stroke = { width: arg0 };
    }
    if (typeof arg0 === "string" || arg0 instanceof PGColour) {
      this._stroke = { colour: <ColourString>arg0.toString() };
    }
    if (typeof arg0 === "boolean") {
      this._stroke = arg0;
      return;
    }
    if (typeof arg0 === "object" && ("width" in arg0 || "colour" in arg0)) {
      this._stroke = { ...arg0 };
      return;
    }
    if (arg1 && typeof this._stroke === "object" && "width" in this._stroke) {
      this._stroke = { ...this._stroke, colour: <ColourString>arg1.toString() };
    }

    if (this._stroke === undefined) {
      throw new Error(`Error: Stroke remains undeifned.
        Label: ${this._label}`);
    }
  }
}

export { PGShape };
