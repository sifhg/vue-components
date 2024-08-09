// Formulas for converting colour formats: https://wizlogo.com/cmyk-to-rgb

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
type HEX = `#${string}`;
type GREYSCALE = number;
type EncodingType = RGB | HSL | CMYK | HEX | GREYSCALE;
type ColourString = `rgb(${string})`;
type EncodingSpecifier = "RGB" | "HSL" | "CMYK" | "HEX" | "GREYSCALE";

function createColour(type: "RGB", r: number, g: number, b: number): Colour;
function createColour(type: "HSL", h: number, s: number, l: number): Colour;
function createColour(
  type: "CMYK",
  c: number,
  m: number,
  y: number,
  k: number
): Colour;
function createColour(type: "HEX", hexCode: HEX): Colour;
function createColour(type: "GREYSCALE", l: number): Colour;
function createColour(
  type: EncodingSpecifier,
  arg0: number | HEX,
  arg1?: number,
  arg2?: number,
  arg3?: number
): Colour {
  switch (type) {
    case "RGB":
      return new Colour(type, <number>arg0, <number>arg1, <number>arg2);
    case "HSL":
      return new Colour(type, <number>arg0, <number>arg1, <number>arg2);
    case "CMYK":
      return new Colour(
        type,
        <number>arg0,
        <number>arg1,
        <number>arg2,
        <number>arg3
      );
    case "HEX":
      return new Colour(type, <HEX>arg0);
    case "GREYSCALE":
      return new Colour(type, <number>arg0);
  }
}

function isColourString(subject: unknown): boolean {
  if (typeof subject !== "string") {
    return false;
  }
  if (
    (subject.startsWith("rgb(") ||
      subject.startsWith("hsl(") ||
      subject.startsWith("cmyk(") ||
      subject.startsWith("g(")) &&
    subject.endsWith(")")
  ) {
    return true;
  }
  if (
    subject.startsWith("#") &&
    subject.length === 7 &&
    !isNaN(Number(subject.slice(1)))
  ) {
    return true;
  }
  return false;
}

class Colour {
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

export {
  Colour,
  createColour,
  isColourString,
  EncodingType,
  ColourString,
  EncodingSpecifier,
};
