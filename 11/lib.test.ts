import { assertEquals } from "https://deno.land/std@0.107.0/testing/asserts.ts";
import { parseInput, part1, part2 } from "./lib.ts";

const testInput = 
`5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`;

Deno.test("part1", () => {
  const want = 1656;
  const result = part1(parseInput(testInput));

  assertEquals(result, want);
});

Deno.test("part1 proper", async () => {
  const want = 1625;
  const input = await Deno.readTextFile("./input.txt");
  const result = part1(parseInput(input));

  assertEquals(result, want);
});

Deno.test("part2", () => {
  const want = 195;
  const result = part2(parseInput(testInput));

  assertEquals(result, want);
});

Deno.test("part2 proper", async () => {
  const want = 244;
  const input = await Deno.readTextFile("./input.txt");
  const result = part2(parseInput(input));

  assertEquals(result, want);
});
