import { is } from "./functional.ts";
import { BinaryArray } from "./types.ts";

export function binaryArrayToDecimal(bin: BinaryArray): number {
  return Number("0b" + bin.join(""));
}

export function countSetBits(n: number) {
  return n.toString(2).split("").filter(is("1")).length;
}
