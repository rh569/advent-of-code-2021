import { assertEquals } from "https://deno.land/std@0.107.0/testing/asserts.ts";
import { binaryArrayToDecimal, countSetBits } from "./number.ts";

Deno.test("binaryArrayToDecimal", () => {
  const want = 22;
  const result = binaryArrayToDecimal([1, 0, 1, 1, 0]);

  assertEquals(want, result);
});

const countSetBitsCases = [
  [0, 0],
  [1, 1],
  [2, 1],
  [64, 1],
  [255, 8],
];

countSetBitsCases.forEach(([num, want]) => {
  Deno.test(`countSetBits: ${num}`, () => {
    const result = countSetBits(num);
    assertEquals(result, want);
  });
});
