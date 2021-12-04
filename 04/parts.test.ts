import { assertEquals } from "https://deno.land/std@0.107.0/testing/asserts.ts";
import { testInput } from "./lib.test.ts";
import { parseInput } from "./lib.ts";
import { part1, part2 } from "./parts.ts";

Deno.test("part 1", () => {
  const want = 4512;
  const [draw, boards] = parseInput(testInput);
  const result = part1(draw, boards);

  assertEquals(result, want);
});

Deno.test("part 2", () => {
  const want = 1924;
  const [draw, boards] = parseInput(testInput);
  const result = part2(draw, boards);

  assertEquals(result, want);
});
