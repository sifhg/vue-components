import { ArrayVector, Coordinate } from "../types";

class PGVector {
  private arrayVector: ArrayVector;

  constructor(x: number, y: number);
  constructor(coordinate: Coordinate | ArrayVector);
  constructor(arg0: number | Coordinate | ArrayVector, arg1?: number) {
    if (typeof arg0 === "number" && typeof arg1 === "number") {
      this.arrayVector = [arg0, arg1];
      return;
    }
    if (
      typeof arg0 === "object" &&
      "x" in arg0 &&
      "y" in arg0 &&
      typeof arg0.x === "number" &&
      typeof arg0.y === "number" &&
      arg1 === undefined
    ) {
      this.arrayVector = [arg0.x, arg0.y];
      return;
    }
    if (
      Array.isArray(arg0) &&
      arg0.length === 2 &&
      typeof arg0[0] === "number" &&
      typeof arg0[1] === "number" &&
      arg1 === undefined
    ) {
      this.arrayVector = [...arg0];
      return;
    }
    throw new Error(`Invalid input for class constructor of Vector.`);
  }
  clone() {
    return new PGVector(this.arrayVector);
  }
  toString(): string {
    return `[${this.arrayVector[0]}, ${this.arrayVector[1]}]`;
  }
  set x(newX: number) {
    this.arrayVector[0] = newX;
  }
  get x(): number {
    return this.arrayVector[0];
  }
  set y(newY: number) {
    this.arrayVector[1] = newY;
  }
  get y(): number {
    return this.arrayVector[1];
  }
}

export { PGVector };
