import { assertEquals } from "https://deno.land/std@0.107.0/testing/asserts.ts";
import { parseInput, part1, part2 } from "./lib.ts";

const testInput = `16,1,2,0,4,2,7,1,2,14`;

Deno.test("part 1", () => {
  const want = 37;
  const result = part1(parseInput(testInput));

  assertEquals(result, want);
});

Deno.test("part 2", () => {
  const want = 168;
  const result = part2(parseInput(testInput));

  assertEquals(result, want);
});
