import { assertEquals } from "https://deno.land/std@0.107.0/testing/asserts.ts";
import { parseInput, part1, part2 } from "./lib.ts";

const testInput = `3,4,3,1,2`;

Deno.test("parse input", () => {
  const want = [3, 4, 3, 1, 2];

  const result = parseInput(testInput);

  assertEquals(result, want);
});

Deno.test("part1", () => {
  const want = 5934;

  const result = part1(parseInput(testInput));

  assertEquals(result, want);
});

Deno.test("part2", () => {
  const want = 26984457539;

  const result = part2(parseInput(testInput));

  assertEquals(result, want);
});
