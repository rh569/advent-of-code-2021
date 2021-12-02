import { assertEquals } from "https://deno.land/std@0.107.0/testing/asserts.ts";

import { parseInput, part1, part2 } from "./lib.ts";

const testInput = `forward 5
down 5
forward 8
up 3
down 8
forward 2`;

Deno.test("can parse input", () => {
  const want = [
    ["forward", 5],
    ["down", 5],
    ["forward", 8],
    ["up", 3],
    ["down", 8],
    ["forward", 2],
  ];

  const result = parseInput(testInput);

  return assertEquals(result, want);
});

Deno.test("part1 test input", () => {
  const want = 150;

  const result = part1(parseInput(testInput));

  assertEquals(want, result);
});

Deno.test("part2 test input", () => {
  const want = 900;

  const result = part2(parseInput(testInput));

  assertEquals(want, result);
});
