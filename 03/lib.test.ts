import { assertEquals } from "https://deno.land/std@0.107.0/testing/asserts.ts";
import {
  findCO2Rate,
  findEpsilonRate,
  findGammaRate,
  findO2Rate,
  parseInput,
  part1,
  part2,
} from "./lib.ts";

const testInput = `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`;

Deno.test("can parse input", () => {
  const smallInput = `00100
11110
10110`;

  const want = [
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 1, 1, 0],
  ];

  const result = parseInput(smallInput);

  return assertEquals(result, want);
});

Deno.test("o2 rate", () => {
  const want = [1, 0, 1, 1, 1];
  const result = findO2Rate(parseInput(testInput));

  assertEquals(want, result);
});

Deno.test("co2 rate", () => {
  const want = [0, 1, 0, 1, 0];
  const result = findCO2Rate(parseInput(testInput));

  assertEquals(want, result);
});

Deno.test("gamma rate", () => {
  const want = [1, 0, 1, 1, 0];
  const result = findGammaRate(parseInput(testInput));

  assertEquals(want, result);
});

Deno.test("epsilon rate", () => {
  const want = [0, 1, 0, 0, 1];
  const result = findEpsilonRate([1, 0, 1, 1, 0]);

  assertEquals(want, result);
});

Deno.test("part1 test input", () => {
  const want = 198;

  const result = part1(parseInput(testInput));

  assertEquals(want, result);
});

Deno.test("part2 test input", () => {
  const want = 230;

  const result = part2(parseInput(testInput));

  assertEquals(want, result);
});
