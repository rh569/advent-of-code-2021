import { assertEquals } from "https://deno.land/std@0.107.0/testing/asserts.ts";
import { binaryArrayToDecimal } from "./number.ts";

Deno.test("toDec", () => {
  const want = 22;
  const result = binaryArrayToDecimal([1, 0, 1, 1, 0]);

  assertEquals(want, result);
});
