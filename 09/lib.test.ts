import { assertEquals } from "https://deno.land/std@0.107.0/testing/asserts.ts";
import { parseInput, part1, part2 } from "./lib.ts";

const testInput = `2199943210
3987894921
9856789892
8767896789
9899965678`;

Deno.test("parseInput", () => {
  const want = [
    [2, 1, 9, 9, 9, 4, 3, 2, 1, 0],
    [3, 9, 8, 7, 8, 9, 4, 9, 2, 1],
    [9, 8, 5, 6, 7, 8, 9, 8, 9, 2],
    [8, 7, 6, 7, 8, 9, 6, 7, 8, 9],
    [9, 8, 9, 9, 9, 6, 5, 6, 7, 8],
  ];
  const result = parseInput(testInput);

  assertEquals(result, want);
});

Deno.test("part1", () => {
  const want = 15;
  const [result, _] = part1(parseInput(testInput));

  assertEquals(result, want);
});

Deno.test("part2", () => {
  const want = 1134;
  const result = part2(parseInput(testInput));

  assertEquals(result, want);
});
