import { BinaryArray } from "./types.ts";

export function binaryArrayToDecimal(bin: BinaryArray): number {
  let dec = 0;

  bin.forEach((bit, index) => {
    if (bit) {
      dec += Math.pow(2, bin.length - index - 1);
    }
  });

  return dec;
}
