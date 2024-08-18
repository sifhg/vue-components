import { PGColour } from "./classes/PGColour.js";

export type PGColor = PGColour;
export type ColourString = `rgb(${string})`;
export type Size = { w: number; h: number };
export type HEX = `#${string}`;
export type Coordinate = { x: number; y: number };
export type ArrayVector = [number, number];
export type EncodingSpecifier = "RGB" | "HSL" | "CMYK" | "HEX" | "GREYSCALE";
