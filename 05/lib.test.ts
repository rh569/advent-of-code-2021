import { assertEquals } from "https://deno.land/std@0.107.0/testing/asserts.ts";
import { LineSegment, parseInput, part1, part2 } from "./lib.ts";

const testParseInput = `0,9 -> 5,9
8,0 -> 0,8
1,5 -> 1,7`;

const testInput = `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`;

Deno.test("parse input", () => {
  const want: LineSegment[] = [
    { start: { x: 0, y: 9 }, end: { x: 5, y: 9 }, isCardinal: true },
    { start: { x: 8, y: 0 }, end: { x: 0, y: 8 }, isCardinal: false },
    { start: { x: 1, y: 5 }, end: { x: 1, y: 7 }, isCardinal: true },
  ];

  const result = parseInput(testParseInput);

  assertEquals(result, want);
});

Deno.test("part1", () => {
  const want = 5;

  const result = part1(parseInput(testInput));

  assertEquals(result, want);
});

Deno.test("part2", () => {
  const want = 12;

  const result = part2(parseInput(testInput));

  assertEquals(result, want);
});
