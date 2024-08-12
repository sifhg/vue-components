import { PGColour } from "../classes/PGColour";
import { EncodingSpecifier, HEX } from "../types";

function createColour(type: "RGB", r: number, g: number, b: number): PGColour;
function createColour(type: "HSL", h: number, s: number, l: number): PGColour;
function createColour(
  type: "CMYK",
  c: number,
  m: number,
  y: number,
  k: number
): PGColour;
function createColour(type: "HEX", hexCode: HEX): PGColour;
function createColour(type: "GREYSCALE", l: number): PGColour;
function createColour(
  type: EncodingSpecifier,
  arg0: number | HEX,
  arg1?: number,
  arg2?: number,
  arg3?: number
): PGColour {
  switch (type) {
    case "RGB":
      return new PGColour(type, <number>arg0, <number>arg1, <number>arg2);
    case "HSL":
      return new PGColour(type, <number>arg0, <number>arg1, <number>arg2);
    case "CMYK":
      return new PGColour(
        type,
        <number>arg0,
        <number>arg1,
        <number>arg2,
        <number>arg3
      );
    case "HEX":
      return new PGColour(type, <HEX>arg0);
    case "GREYSCALE":
      return new PGColour(type, <number>arg0);
  }
  throw new Error(`createColour must have a valid type argument`);
}

export { createColour };
