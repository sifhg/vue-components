import { PGVector } from "../classes/PGVector";
import { ArrayVector, Coordinate } from "../types";

function createVectorArray(
  coordinates: Array<Coordinate | ArrayVector | PGVector>
): Array<PGVector> {
  const NEW_VECTOR_ARRAY: Array<PGVector> = [];
  for (const COORD of coordinates) {
    if (COORD instanceof PGVector) {
      NEW_VECTOR_ARRAY.push(COORD.clone());
    } else if (COORD instanceof Array) {
      NEW_VECTOR_ARRAY.push(new PGVector(...COORD));
    } else {
      NEW_VECTOR_ARRAY.push(new PGVector(COORD.x, COORD.y));
    }
  }
  return NEW_VECTOR_ARRAY;
}

export { createVectorArray };
