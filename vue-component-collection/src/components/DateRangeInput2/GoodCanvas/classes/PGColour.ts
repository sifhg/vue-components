// Formulas for converting colour formats: https://wizlogo.com/cmyk-to-rgb

import { ColourString, EncodingSpecifier, HEX } from "../types.js";

type RGB = {
  r: number;
  g: number;
  b: number;
};
type HSL = {
  h: number;
  s: number;
  l: number;
};
type CMYK = {
  c: number;
  m: number;
  y: number;
  k: number;
};
type GREYSCALE = number;
type EncodingType = RGB | HSL | CMYK | HEX | GREYSCALE;

class PGColour {
  private encodingType: EncodingSpecifier;
  private colourValue: EncodingType;
  private asRGB: RGB;
  constructor(type: "RGB", r: number, g: number, b: number);
  constructor(type: "HSL", h: number, s: number, l: number);
  constructor(type: "CMYK", c: number, m: number, y: number, k: number);
  constructor(type: "HEX", hexCode: HEX);
  constructor(type: "GREYSCALE", l: number);
  constructor(
    type: EncodingSpecifier,
    arg0: number | HEX,
    arg1?: number,
    arg2?: number,
    arg3?: number
  ) {
    this.encodingType = type;
    switch (type) {
      case "RGB":
        this.colourValue = <RGB>{
          r: arg0,
          g: arg1,
          b: arg2,
        };
        break;
      case "HSL":
        this.colourValue = <HSL>{
          h: arg0,
          s: arg1,
          l: arg2,
        };
        break;
      case "CMYK":
        this.colourValue = <CMYK>{
          c: arg0,
          m: arg1,
          y: arg2,
          k: arg3,
        };
        break;
      case "HEX":
        this.colourValue = <HEX>arg0;
        break;
      case "GREYSCALE":
        this.colourValue = <GREYSCALE>arg0;
        break;
    }
    this.asRGB = this.RGB;
  }
  get RGB(): RGB {
    switch (this.encodingType) {
      case "RGB":
        return <RGB>this.colourValue;
        break;
      case "HSL":
        //Formula needs writing
        return {
          r: 0,
          g: 0,
          b: 0,
        };
        break;
      case "CMYK":
        //Formula needs writing
        return {
          r: 0,
          g: 0,
          b: 0,
        };
        break;
      case "HEX":
        //Formula needs writing
        return {
          r: 0,
          g: 0,
          b: 0,
        };
        break;
      case "GREYSCALE":
        return {
          r: <GREYSCALE>this.colourValue,
          g: <GREYSCALE>this.colourValue,
          b: <GREYSCALE>this.colourValue,
        };
        break;
      default:
        throw new Error(
          `The colour has an invalid encoding type. Encoding type is: ${this.encodingType}`
        );
    }
  }
  toString(): ColourString {
    return `rgb(${this.RGB.r} ${this.RGB.g} ${this.RGB.b})`;
  }
}

export { PGColour };
